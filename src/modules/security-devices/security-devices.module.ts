import { Module } from '@nestjs/common';
import { SecurityDevicesQueryRepository } from './api/queryRepository/security-devices.query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';

const useCases = [];
const adapters = [SecurityDevicesQueryRepository];

@Module({
  controllers: [SecurityDevicesController],
  providers: [...useCases, ...adapters],
})
export class SecurityDevicesModule {}
