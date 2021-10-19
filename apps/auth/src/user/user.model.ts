import BaseAndTimeStamps from '../types/typegoose.types';
import { prop } from '@typegoose/typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

export type DbDocumentUser = DocumentType<UserModel>;
export type DbModelUser = ModelType<UserModel>;

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
