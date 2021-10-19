import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtCommonGuard extends AuthGuard('jwt-common') {}

