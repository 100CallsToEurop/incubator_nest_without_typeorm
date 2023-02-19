import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { SecurityDeviceDto } from '../../infrastructure/dto/security-devices.dto';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class UpdateDeviceCommand {
  constructor(public newUserSessionDevice: SecurityDeviceDto) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: UpdateDeviceCommand): Promise<void> {
    const { newUserSessionDevice } = command;

    let securityDevice =
      await this.securityDevicesRepository.getSecurityDevicesByDeviceId(
        newUserSessionDevice.deviceId,
      );
    if (securityDevice) {
      await this.securityDevicesRepository.updateSecurityDevice(
        newUserSessionDevice,
      );
    } else {
      await this.securityDevicesRepository.createSecurityDevice(
        newUserSessionDevice,
      );
    }
  }
}
