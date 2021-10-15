import {
  IsMobilePhone,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @IsMobilePhone()
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @Length(10, 20)
  password: string;
}
