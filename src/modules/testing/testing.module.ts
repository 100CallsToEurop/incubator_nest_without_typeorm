import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { TestingRepository } from './infrastructure/testing.query.repository';

const adapters = [TestingRepository];

@Module({
  controllers: [TestingController],
  providers: [...adapters],
})
export class TestingModule {}
