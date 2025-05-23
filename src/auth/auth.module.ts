import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HelperService } from 'src/shared';
import { JwtHandler } from 'src/shared/jwt-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PasswordResetService } from 'src/password-reset/password-reset.service';
import { PasswordReset } from 'src/password-reset/entities/password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordReset])],
  controllers: [AuthController],
  providers: [
    AuthService,
    HelperService,
    JwtHandler,
    JwtService,
    UserService,
    PasswordResetService,
  ],
})
export class AuthModule {}
