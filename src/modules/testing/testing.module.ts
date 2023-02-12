import { Module } from '@nestjs/common';
import { TestingQueryRepository } from './api/queryRepository/testing.query.repository';
import { TestingController } from './api/testing.controller';

const adapters = [TestingQueryRepository];

@Module({
  controllers: [TestingController],
  providers: [...adapters],
})
export class TestingModule {}
