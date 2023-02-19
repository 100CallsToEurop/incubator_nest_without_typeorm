import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { SaController } from './api/sa.controller';
import { CqrsModule } from '@nestjs/cqrs';
import {
  BanUserUseCase,
  CreateUserUseCase,
  DeleteUserByIdUseCase,
} from './application/useCases';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './api/queryRepository/dto/users.query.repository';

const useCases = [
  DeleteUserByIdUseCase,
  CreateUserUseCase,
  BanUserUseCase,
  //BanUserBlogUseCase,
];

const adapters = [UsersRepository, UsersQueryRepository];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController, SaController],
  providers: [...useCases, ...adapters],
})
export class UsersModule {}
