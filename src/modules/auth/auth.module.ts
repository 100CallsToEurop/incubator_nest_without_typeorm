import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthQueryRepository } from './api/queryRepository/auth.query.repository';

const useCases = []
const adapters = [AuthQueryRepository];

@Module({
  controllers: [AuthController],
  providers: [...useCases, ...adapters]
})
export class AuthModule {}
