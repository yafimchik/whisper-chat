import BaseAndTimeStamps from '../types/typegoose.types';
import { prop, ReturnModelType } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';

export type DbDocumentUser = DocumentType<UserModel>;
export type DbModelUser = ReturnModelType<typeof UserModel>;

export default class UserModel extends BaseAndTimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  activationCodeHash: string;

  @prop()
  isActivated: boolean;
}
