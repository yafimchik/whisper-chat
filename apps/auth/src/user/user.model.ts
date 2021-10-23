import { prop, ReturnModelType } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export type DbDocumentUser = DocumentType<UserModel>;
export type DbModelUser = ReturnModelType<typeof UserModel>;

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  activationCodeHash: string;

  @prop()
  isActivated: boolean;
}
