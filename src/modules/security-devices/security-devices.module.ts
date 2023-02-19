import { Module } from '@nestjs/common';
import { SecurityDevicesQueryRepository } from './api/queryRepository/security-devices.query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import {
  DeleteAllUserDevicesUseCase,
  DeleteDeviceUseCase,
  UpdateDeviceUseCase,
} from './application/useCases';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';

const useCases = [
  UpdateDeviceUseCase,
  DeleteDeviceUseCase,
  DeleteAllUserDevicesUseCase,
];
const adapters = [SecurityDevicesQueryRepository, SecurityDevicesRepository];

@Module({
  controllers: [SecurityDevicesController],
  providers: [...useCases, ...adapters],
})
export class SecurityDevicesModule {}
