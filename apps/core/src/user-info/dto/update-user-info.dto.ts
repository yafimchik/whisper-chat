import { PartialType } from '@nestjs/mapped-types';
import CreateUserInfoDto from './create-user-info.dto';

export default class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) {}
