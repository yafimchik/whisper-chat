import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { mongoose } from '@typegoose/typegoose';

export default class BaseAndTimeStamps implements Base, TimeStamps {
  _id: mongoose.Types.ObjectId;
  __v: number;
  __t: undefined | string | number;
  createdAt: Readonly<Date>;
  updatedAt: Readonly<Date>;
}
