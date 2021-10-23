export interface IUserUpdate {
  email?: string;
  passwordHash?: string;
  activationCodeHash?: string;
  isActivated?: boolean;
}

export interface IUser extends ISecuredUser {
  passwordHash: string;
  activationCodeHash: string;

  getSecuredUser: () => ISecuredUser;
}

export interface ISecuredUser {
  email: string;
  _id: string;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
