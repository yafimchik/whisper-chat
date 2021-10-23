import { ISecuredUser, IUser } from '../user.interface';
import { DbDocumentUser } from '../user.model';

export default class UserEntity implements IUser {
  public readonly _id: string;

  public readonly email: string;

  public readonly passwordHash: string;

  public readonly activationCodeHash: string;

  public readonly isActivated: boolean;

  public readonly updatedAt: Date;

  public readonly createdAt: Date;

  public constructor(user: IUser | DbDocumentUser) {
    this._id = typeof user._id === 'string' ? user._id : user._id.toString();
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.activationCodeHash = user.activationCodeHash;
    this.isActivated = user.isActivated;
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
  }

  public getSecuredUser(): ISecuredUser {
    return {
      _id: this._id,
      email: this.email,
      isActivated: this.isActivated,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }
}
