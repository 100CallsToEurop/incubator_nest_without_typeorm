import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteAllUserDevicesCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(DeleteAllUserDevicesCommand)
export class DeleteAllUserDevicesUseCase
  implements ICommandHandler<DeleteAllUserDevicesCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: DeleteAllUserDevicesCommand): Promise<void> {
    const { userId, deviceId } = command;
    await this.securityDevicesRepository.deleteAllSecurityDeviceByIdWithoutCurrentDeviceId(
      userId,
      deviceId,
    );
  }
}
