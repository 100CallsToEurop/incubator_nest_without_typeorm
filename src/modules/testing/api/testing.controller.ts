import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepository } from '../infrastructure/testing.query.repository';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingRepository: TestingRepository) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAllData() {
    await this.testingRepository.deleteAll();
  }
}
