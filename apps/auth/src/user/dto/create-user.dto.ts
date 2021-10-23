import { IsEmail, IsString, MinLength } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password length must be greater or equal 8' })
  password: string;
}
