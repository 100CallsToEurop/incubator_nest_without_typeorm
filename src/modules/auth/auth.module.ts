import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityDevicesModule } from '../security-devices/security-devices.module';
import { TokensModule } from '../tokens/tokens.module';
import { AuthController } from './api/auth.controller';
import { AuthQueryRepository } from './api/queryRepository/auth.query.repository';
import { AuthService } from './application/auth.service';
import {
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
} from './application/useCases';
import { EmailManager } from './infrastructure/adapters/emailManager';

const useCases = [
  PasswordNewUseCase,
  PasswordRecoveryUseCase,
  UserLoginUseCase,
  UserLogoutUseCase,
  UserRegistrationConfirmationUseCase,
  UserRegistrationEmailResendingUseCase,
  UserRegistrationUseCase,
];
const adapters = [AuthQueryRepository, EmailManager];

@Module({
  imports: [CqrsModule, MailerModule, SecurityDevicesModule, TokensModule],
  controllers: [AuthController],
  providers: [...useCases, ...adapters, AuthService],
})
export class AuthModule {}
