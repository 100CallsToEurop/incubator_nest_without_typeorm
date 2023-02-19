import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
//import { SecurityDevicesRepository } from '../../../../modules/security-devices/infrastructure/security-devices.repository';
import { BanUserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BanUserDto } from '../dto';

export class BanUserCommand {
  constructor(public id: string, public banUserParams: BanUserInputModel) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    //private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: BanUserCommand): Promise<void> {
    const { id, banUserParams } = command;
    const user = await this.usersRepository.getUserById(id);
    const { isBanned, banReason } = banUserParams;

    const banDate = isBanned ? new Date() : null;
    const banReasonText = isBanned ? banReason : null;

    const banUserDto: BanUserDto = {
      userId: id,
      isBanned: isBanned,
      banDate: banDate,
      banReason: banReasonText,
    };

    await this.usersRepository.banUser(banUserDto);
  }
}
