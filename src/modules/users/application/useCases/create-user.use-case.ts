import { UserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
export class CreateUserCommand {
  constructor(
    public createParam: UserInputModel,
    public isConfirmed: boolean,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async checkEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
    if (checkUserEmailOrLogin) {
      throw new BadRequestException({
        message: [`${field} already exists`],
      });
    }
  }

  async execute(command: CreateUserCommand): Promise<string> {
    const { createParam, isConfirmed } = command;

    await this.checkEmailOrLogin(createParam.email);
    await this.checkEmailOrLogin(createParam.login);

    createParam.password = await bcrypt.hash(createParam.password, 10);

    const userId = await this.usersRepository.createUser(
      createParam,
      isConfirmed,
    );

    console.log(userId);
    return userId;
  }
}
