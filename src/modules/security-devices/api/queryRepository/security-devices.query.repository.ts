import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SecurityDeviceDto } from '../../infrastructure/dto/security-devices.dto';

import { DeviceViewModel } from './dto/security-devices.view-model';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  buildResponseDevice(device: SecurityDeviceDto): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.user_agent,
      lastActiveDate: new Date(+device.iat * 1000).toISOString(),
      deviceId: device.deviceId,
    };
  }

  async getSecurityDevices(userId: string): Promise<SecurityDeviceDto[]> {
    const query = `SELECT * FROM public."SecurityDevices" AS sd WHERE sd."userId" = $1`;
    return await this.dataSource.query(query, [userId]);
  }

  async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices = await this.getSecurityDevices(userId);
    return devices.map((d) => this.buildResponseDevice(d));
  }
}
