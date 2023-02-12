import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { LoginInputModel } from "../models/auth-login.model";
import { MeViewModel } from "./dto";

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectDataSource() private dataSorce: DataSource) {}

  private buildPayloadResponseUser(user: User): MeViewModel {
    return {
      userId: user._id.toString(),
      email: user.getUserEmail(),
      login: user.getUserLogin(),
    };
  }

  private async findUserByEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const findUserEmailOrLogin =
      await this.dataSorce.query(emailOrLogin);
    if (!findUserEmailOrLogin && field === 'email') {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }

    if (!findUserEmailOrLogin && field === 'login') {
      throw new UnauthorizedException();
    }
    return findUserEmailOrLogin;
  }

  async checkCredentials(loginParam: LoginInputModel): Promise<MeViewModel> {
    const user = await this.findUserByEmailOrLogin(loginParam.loginOrEmail);
    if (await user.checkPassword(loginParam.password)) {
      return this.buildPayloadResponseUser(user);
    }
    throw new UnauthorizedException();
  }
}