import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Dev!, Welcome to CrestTechHub API';
  }
}
