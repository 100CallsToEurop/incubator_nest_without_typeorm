import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SecurityDeviceDto } from './dto/security-devices.dto';

@Injectable()
export class SecurityDevicesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createSecurityDevice(
    securityDevice: SecurityDeviceDto,
  ): Promise<SecurityDeviceDto> {
    const query = `INSERT INTO public."SecurityDevices"(ip, user_agent, iat, exp, "userId") VALUES ($1, $2, $3, $4, $5);
                  SELECT * FROM public."SecurityDevices" AS sd WHERE sd."userId" = $5`;

    const result = await this.dataSource.query(query, [
      securityDevice.ip,
      securityDevice.user_agent,
      securityDevice.iat,
      securityDevice.exp,
      securityDevice.userId,
    ]);

    return result[0];
  }

  async updateSecurityDevice(
    update: SecurityDeviceDto,
  ): Promise<SecurityDeviceDto | boolean> {
    const { iat, exp, deviceId, ip, user_agent, userId } = update;

    const query = `UPDATE public."SecurityDevices" AS sd
    SET ip = $4, user_agent = $5, iat = $1, exp = $2
    WHERE sd."deviceId" = $3 AND sd."userId" = $6
    `;

    const result = await this.dataSource.query(query, [
      iat,
      exp,
      deviceId,
      ip,
      user_agent,
      userId,
    ]);

    return result[0] ? true : false;
  }

  async deleteSecurityDeviceById(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const query = `DELETE FROM public."SecurityDevices" as sd WHERE sd."deviceId" = $1 AND sd."userId" = $2`;
    return await this.dataSource.query(query, [deviceId, userId]);
  }

  async deleteAllSecurityDeviceById(userId: string): Promise<any> {
    const query = `DELETE FROM public."SecurityDevices" as sd WHERE sd."userId" = $1`;
    return await this.dataSource.query(query, [userId]);
  }

  async deleteAllSecurityDeviceByIdWithoutCurrentDeviceId(
    userId: string,
    currentDeviceId: string,
  ): Promise<any> {
    const query = `DELETE FROM public."SecurityDevices" as sd WHERE sd."userId" = $1 AND sd."deviceId" is distinct from $2`;
    return await this.dataSource.query(query, [userId, currentDeviceId]);
  }

  async getSecurityDevicesByDeviceId(
    deviceId: string,
  ): Promise<SecurityDeviceDto> {
    const query = `SELECT * FROM public."SecurityDevices" AS sd WHERE sd."deviceId" = $1`;
    const result = await this.dataSource.query(query, [deviceId]);
    return result[0];
  }

  async getSecurityDevicesByUserId(
    userId: string,
  ): Promise<SecurityDeviceDto[]> {
    const query = `SELECT * FROM public."SecurityDevices" AS sd WHERE sd."userId" = $1`;
    return await this.dataSource.query(query, [userId]);
  }
}
