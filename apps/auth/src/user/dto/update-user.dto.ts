import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password length must be greater or equal 8' })
  password?: string;

  @IsOptional()
  @IsString()
  activationCode?: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
