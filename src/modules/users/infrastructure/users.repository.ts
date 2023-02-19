import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { add } from 'date-fns';
import { DataSource } from 'typeorm';

//Models
import { UserInputModel } from '../api/models';
import { UserViewModel } from '../api/queryRepository/dto/user-view.model';
import { BanUserDto } from '../application/dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private buildResponseUser(result: any): UserViewModel {
    return {
      id: result.id,
      login: result.login,
      email: result.email,
      createdAt: result.createdAt,
      banInfo: {
        isBanned: result.isBanned,
        banDate: result.banDate,
        banReason: result.banReason,
      },
    };
  }

  async getUserById(userId: string): Promise<UserViewModel> {
    const query = ` 
SELECT * FROM Public."Users" as us
WHERE
us.id = $1`;
    const result = await this.dataSource.query(query, [userId]);
    return this.buildResponseUser(result);
  }

  async createUser(
    createParam: UserInputModel,
    isConfirmed: boolean,
  ): Promise<string> {
    const query = `
 WITH user_data AS (
 INSERT INTO public."Users"(
	login, email, "passwordHash", "refreshToken")
	VALUES ($1, $2, $3, NULL)
	RETURNING *
  ), 
 ban_user AS (
 INSERT INTO public."BanUser"(
	"banReason", "banDate", "userId")
	VALUES (NULL, NULL, (SELECT id from user_data))
  RETURNING *
 ),
 em_conf AS (
 INSERT INTO public."EmailConfirmation"(
	"confirmationCode", "expirationDate", "isConfirmed", "userId")
	VALUES (NULL, NULL, $4, (SELECT id from user_data))
	RETURNING *
 ),
 ps_rec AS (
 INSERT INTO public."PasswordRecovery"(
	"confirmationCode", "expirationDate", "isConfirmed", "userId")
	VALUES (NULL, NULL, false, (SELECT id from user_data))
	RETURNING *
	)
	   
 SELECT ud.id FROM user_data AS ud 
    `;

    const result = await this.dataSource.query(query, [
      createParam.login,
      createParam.email,
      createParam.password,
      isConfirmed,
    ]);
    return result[0].id; 
  }

  async findUserByEmailOrLogin(emailOrLogin: string): Promise<UserViewModel> {

    const query = `
SELECT * FROM public."Users" AS us 
INNER JOIN public."BanUser" AS bu ON us.id = bu."userId" 
WHERE us.login = $1 OR us.email = $1

`;

    const result = await this.dataSource.query(query, [emailOrLogin]);
    return result.length > 0 ? this.buildResponseUser(result) : null;
  }

  async banUser(banUserDto: BanUserDto) {
    const { userId, isBanned, banDate, banReason } = banUserDto;
    const query = `
UPDATE public."BanUser" as bu
SET 
  "isBanned" = $2, 
  "banDate" = $3,
  "banReason" = $4
WHERE
bu."userId" = $1`;
    return await this.dataSource.query(query, [
      userId,
      isBanned,
      banDate,
      banReason,
    ]);
  }

  async updateUser(userId: string, update: UserInputModel): Promise<any> {
    return await this.dataSource.query('');
  }

  async deleteUserById(userId: string): Promise<any> {
    const query = `
DELETE FROM Public."Users" as us
WHERE
us.id = $1`;
    return await this.dataSource.query(query, [userId]);
  }

  // async updateConfirmationState(userId: string): Promise<void> {
  //   const user = await this.userModel
  //     .findByIdAndUpdate(
  //       { _id: new Types.ObjectId(userId) },
  //       { 'emailConfirmation.isConfirmed': true },
  //       { new: true },
  //     )
  //     .exec();
  // }

  // async updateConfirmationCode(
  //   userId: string,
  //   code: string,
  // ): Promise<IUser | null> {
  //   return await this.userModel
  //     .findByIdAndUpdate(
  //       { _id: new Types.ObjectId(userId) },
  //       {
  //         'emailConfirmation.confirmationCode': code,
  //       },
  //       { new: true },
  //     )
  //     .exec();
  // }

  // async updateUserPasswordHash(userId: string, newHash: string): Promise<void> {
  //   await this.userModel
  //     .findByIdAndUpdate(
  //       { _id: new Types.ObjectId(userId) },
  //       {
  //         'accountData.passwordHash': newHash,
  //         'passwordRecovery.passwordRecoveryCode': '',
  //         'passwordRecovery.isConfirmedPassword': false,
  //       },
  //       { new: true },
  //     )
  //     .exec();
  // }

  // async updatePasswordRecoveryCode(
  //   userId: string,
  //   code: string,
  // ): Promise<IUser | null> {
  //   return await this.userModel
  //     .findByIdAndUpdate(
  //       { _id: new Types.ObjectId(userId) },
  //       {
  //         'passwordRecovery.passwordRecoveryCode': code,
  //         'passwordRecovery.expirationDate': add(new Date(), {
  //           hours: 1,
  //           minutes: 3,
  //         }),
  //         'passwordRecovery.isConfirmedPassword': true,
  //       },
  //       { new: true },
  //     )
  //     .exec();
  // }

  // async updateRefreshToken(
  //   userId: string,
  //   token: string | null,
  // ): Promise<IUser | null> {
  //   return await this.userModel
  //     .findByIdAndUpdate(
  //       { _id: new Types.ObjectId(userId) },
  //       {
  //         'sessions.refreshToken': token,
  //       },
  //       { new: true },
  //     )
  //     .lean()
  //     .exec();
  // }

  // async findUserByToken(token: string): Promise<UserDocument> {
  //   return await this.userModel
  //     .findOne()
  //     .where({
  //       'sessions.refreshToken': token,
  //     })
  //     .exec();
  // }

  // async findByConfirmCode(code: string): Promise<UserDocument | null> {
  //   return await this.userModel
  //     .findOne()
  //     .where({
  //       'emailConfirmation.confirmationCode': code,
  //     })
  //     .exec();
  // }

  // async findByPasswordRecoveryCode(code: string): Promise<UserDocument | null> {
  //   return await this.userModel
  //     .findOne()
  //     .where({
  //       'passwordRecovery.passwordRecoveryCode': code,
  //     })
  //     .exec();
  // }

  // async findBadToken(token: string): Promise<UserDocument | null> {
  //   return await this.userModel
  //     .findOne()
  //     .where({
  //       'sessions.badTokens': { $in: token },
  //     })
  //     .exec();
  // }

  // async addBadToken(userId: string, token: string): Promise<void> {
  //   const user = await this.userModel.findById({
  //     _id: new Types.ObjectId(userId),
  //   });
  //   user.addBadRefreshToken(token);
  //   user.save();
  // }
}
