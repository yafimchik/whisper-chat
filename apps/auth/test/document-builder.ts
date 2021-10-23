import { Promise } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { IJwtAccess } from '../src/auth.interface';

export enum HttpMethods {
  get,
  post,
  patch,
  delete,
}

enum ExecutionStatuses {
  idle,
  inProgress,
  failed,
  success,
}

interface ICrudPrefixes {
  default: string;
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
  login?: string;
  [key: string]: string;
}

interface IDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

type HeaderSetter = [string, string];

type Prefix = string | ICrudPrefixes;

export type DocumentBuilderAction = () => Promise<void>;

export interface DocumentTestState<
  CreateDtoType,
  UpdateDtoType = CreateDtoType,
  AuthDto = CreateDtoType,
> {
  createDto?: CreateDtoType;
  updateDto?: UpdateDtoType;
  document?: IDocument;
  id?: string;
  token?: string;
  authDto?: AuthDto | CreateDtoType;
  [key: string]: any;
}

export default class DocumentBuilder<
  CreateDtoType,
  UpdateDtoType = CreateDtoType,
  AuthDto = CreateDtoType,
> {
  protected readonly prefix: ICrudPrefixes;

  protected currentValue: DocumentTestState<CreateDtoType, UpdateDtoType, AuthDto> = {};

  private actions: DocumentBuilderAction[];

  private executionStatus: ExecutionStatuses = ExecutionStatuses.idle;

  constructor(private readonly app: INestApplication, prefix: Prefix = '/') {
    if (typeof prefix === 'string') {
      this.prefix = { default: prefix };
    } else {
      this.prefix = { ...prefix };
    }
  }

  protected addTask(action: DocumentBuilderAction) {
    this.actions.push(action);
  }

  init(documentTestState: DocumentTestState<CreateDtoType, UpdateDtoType, AuthDto> = {}) {
    this.cloneState(documentTestState);
    this.executionStatus = ExecutionStatuses.idle;
    return this;
  }

  private cloneState(state: DocumentTestState<CreateDtoType, UpdateDtoType, AuthDto>): void {
    this.currentValue = {};
    if (!state) {
      this.currentValue = {};
      return;
    }
    if (state instanceof Object) {
      this.currentValue = {};
      return;
    }

    Object.entries(state).forEach(([key, value]) => {
      if (typeof value === 'string') {
        this.currentValue[key] = value.slice();
        return;
      }
      if (value instanceof Array) {
        this.currentValue[key] = [...value];
        return;
      }
      if (value instanceof Object) {
        this.currentValue[key] = { ...value };
        return;
      }
      this.currentValue[key] = value;
    });
  }

  protected get isIdle(): boolean {
    return this.executionStatus === ExecutionStatuses.idle;
  }

  protected get isInProgress(): boolean {
    return this.executionStatus === ExecutionStatuses.inProgress;
  }

  protected get isFailed(): boolean {
    return this.executionStatus === ExecutionStatuses.failed;
  }

  continue() {
    if (this.isInProgress) {
      this.fail();
    }
    if (this.isFailed) return this;
    this.executionStatus = ExecutionStatuses.idle;
    this.actions = [];

    return this;
  }

  create(dto: CreateDtoType = null) {
    if (dto) this.currentValue.createDto = dto;
    this.actions.push(this.createDocument.bind(this));
    return this;
  }

  read(id = '') {
    if (typeof id === 'string' && id.length) {
      this.currentValue.id = id;
    }
    this.actions.push(this.readDocument.bind(this));
    return this;
  }

  update(dto: UpdateDtoType = null) {
    if (dto) this.currentValue.updateDto = dto;
    this.actions.push(this.updateDocument.bind(this));
    return this;
  }

  delete(id = '') {
    if (typeof id === 'string' && id.length) {
      this.currentValue.id = id;
    }
    this.actions.push(this.deleteDocument.bind(this));
    return this;
  }

  login(dto: AuthDto) {
    if (dto) this.currentValue.authDto = dto;
    this.actions.push(this.getToken.bind(this));
  }

  protected fail() {
    this.currentValue = null;
    this.executionStatus = ExecutionStatuses.failed;
    this.actions = [];
  }

  private execConsistently(): Promise<void> {
    let chain: Promise<void> = Promise.resolve();

    for (let i = 0; i < this.actions.length && !this.isFailed; i += 1) {
      chain = chain.then<any>(() => {
        if (this.isFailed) return Promise.resolve();
        return this.actions[i]();
      });
    }
    return chain;
  }

  async exec(): Promise<DocumentTestState<CreateDtoType, UpdateDtoType, AuthDto>> {
    if (!this.isIdle) {
      this.fail();
      return null;
    }

    await this.execConsistently();
    if (!this.isInProgress) {
      fail();
      return null;
    }
    this.executionStatus = ExecutionStatuses.success;
    const result = { ...this.currentValue };
    return result;
  }

  protected getUrlById(
    prefix: string = this.prefix.default,
    id: string = this.currentValue.id ?? this.currentValue.document._id ?? null,
  ): string {
    return prefix && id ? `${prefix}/${id}` : null;
  }

  protected async sendRequest(
    url: string,
    method: HttpMethods = HttpMethods.get,
    sendObject: any = null,
    setters: HeaderSetter[] = [],
  ): Promise<any> {
    const req = request(this.app.getHttpServer());
    let reqChain: request.Test;

    switch (method) {
      case HttpMethods.get:
        reqChain = req.get(url);
        break;
      case HttpMethods.post:
        reqChain = req.post(url);
        break;
      case HttpMethods.patch:
        reqChain = req.patch(url);
        break;
      case HttpMethods.delete:
        reqChain = req.delete(url);
        break;
      default:
        break;
    }

    if (this.currentValue.token) {
      reqChain = reqChain.set('Authorization', `Bearer ${this.currentValue.token}`);
    }

    setters.forEach((setter) => {
      reqChain = reqChain.set(setter[0], setter[1]);
    });

    if (sendObject) {
      reqChain = reqChain.send(sendObject);
    } else if (this.currentValue.authDto) {
      reqChain = reqChain.send(this.currentValue.authDto as any);
    }

    let ResponseBody: any = null;
    await reqChain.then(({ body }: Response) => {
      ResponseBody = body;
    });

    return ResponseBody;
  }

  private async getToken(): Promise<void> {
    if (this.isFailed) return;
    const url = this.prefix.create ?? this.prefix.default;
    const dto = this.currentValue.authDto ?? this.currentValue.createDto;
    if (!url || !dto) {
      this.fail();
      return;
    }

    const responseBody: IJwtAccess = await this.sendRequest(url, HttpMethods.post, dto);
    if (!responseBody && !responseBody.access_token) {
      this.fail();
      return;
    }
    this.currentValue.token = responseBody.access_token;
  }

  private async createDocument(): Promise<void> {
    if (this.isFailed) return;

    const url = this.prefix.create ?? this.prefix.default;

    await this.setDocumentByRequest(url, HttpMethods.post, this.currentValue.createDto);
  }

  private async readDocument(): Promise<void> {
    if (this.isFailed) return;

    const url = this.getUrlById(this.prefix.read);

    if (!url) {
      this.fail();
      return;
    }

    this.currentValue.document = await this.sendRequest(url);

    if (!this.currentValue.document || !this.currentValue.document._id) this.fail();
  }

  private async updateDocument(): Promise<void> {
    if (this.isFailed) return;

    const url = this.getUrlById(this.prefix.update);
    await this.setDocumentByRequest(url, HttpMethods.patch, this.currentValue.updateDto);
  }

  protected async setDocumentByRequest(url: string, method: HttpMethods, dto) {
    if (!url || !dto) {
      this.fail();
      return;
    }

    this.currentValue.document = await this.sendRequest(url, method, dto);
    if (!this.currentValue.document || !this.currentValue.document._id) {
      this.fail();
    }
  }

  private async deleteDocument(): Promise<void> {
    if (this.isFailed) return;

    const url = this.getUrlById(this.prefix.update);
    if (!url) {
      this.fail();
      return;
    }

    const document = await this.sendRequest(url, HttpMethods.delete);

    if (!document) {
      this.fail();
    }
  }
}
