
import * as uuid from 'uuid';
import {
  CreateJWTTokensCommand,
  DecodeJWTTokenCommand,
} from '../../../../modules/tokens/application/useCases';
import { CommandBus, CommandHandler } from '@nestjs/cqrs/dist';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { UnauthorizedException } from '@nestjs/common';
import { DeviceInputModel } from 'src/modules/security-devices/api/models/security-devices.model';
import { TokensViewModel } from 'src/modules/tokens/application/useCases/dto';

export class UserLoginCommand {
  constructor(public device: DeviceInputModel) {}
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<TokensViewModel> {
    const { device } = command;
    device.deviceId = device.deviceId ?? uuid.v4();
    const { ip, user_agent, ...payload } = device;

    const bannedUser = await this.usersRepository.getUserById(payload.userId)
    if(bannedUser.checkBanned()){
      throw new UnauthorizedException();
    }

    const newTokens = await this.commandBus.execute(
      new CreateJWTTokensCommand(payload),
    );

    const newRefreshToken = newTokens.refreshToken;
    const decodeNewRefreshToken = await this.commandBus.execute(
      new DecodeJWTTokenCommand(newRefreshToken),
    );


    const { login, email, ...payloadForUserSession } = decodeNewRefreshToken;

    const newUserSessionDevice: ISecurityDevice = {
      ip,
      user_agent,
      ...payloadForUserSession,
    };

    await this.commandBus.execute(
      new UpdateDeviceCommand(newUserSessionDevice),
    );

    const user = await this.usersRepository.getUserById(
      payloadForUserSession.userId,
    );
    user.updateRefreshToken(newTokens.refreshToken);
    await this.usersRepository.save(user);
    return newTokens;
  }
}
