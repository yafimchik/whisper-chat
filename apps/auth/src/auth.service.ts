import { Injectable } from '@nestjs/common';

@Injectable()
export default class AuthService {
  private hello = 'Hello World!';

  getHello(): string {
    return this.hello;
  }
}
