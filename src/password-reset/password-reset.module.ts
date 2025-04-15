import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { HelperService } from 'src/shared';
import { JwtHandler } from 'src/shared/jwt-service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  controllers: [],
  providers: [PasswordResetService, HelperService, JwtHandler, JwtService],
})
export class PasswordResetModule {}
