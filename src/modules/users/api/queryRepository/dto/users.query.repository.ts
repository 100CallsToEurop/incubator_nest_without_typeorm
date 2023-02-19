import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Paginated } from '../../../../../modules/paginator/models/paginator';
import { SortDirection } from '../../../../../modules/paginator/models/query-params.model';
import { DataSource } from 'typeorm';
import {
  GetQueryParamsUserDto,
  GetQueryParamsUserDtoForSA,
  userBan,
} from '../../models';
import { UserViewModel } from './user-view.model';

@Injectable()
export class UsersQueryRepository {
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
SELECT us.id, us.login, us.email, us."createdAt", bu."isBanned", bu."banDate", bu."banReason" 
FROM Public."Users" as us
INNER JOIN public."BanUser" AS bu ON  bu."userId" = us.id 
WHERE
us.id = $1`;
    const result = await this.dataSource.query(query, [userId]);

    if (result.length === 0) {
      throw new NotFoundException();
    }
    return this.buildResponseUser(result[0]);
  }

  isSA(
    query: GetQueryParamsUserDto | GetQueryParamsUserDtoForSA,
  ): query is GetQueryParamsUserDtoForSA {
    return 'banStatus' in query;
  }

  async getUsers(
    query?: GetQueryParamsUserDto | GetQueryParamsUserDtoForSA,
  ): Promise<Paginated<UserViewModel[]>> {
    const { sortBy, sortDirection } = query;

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    let countResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM Public."Users"`,
    );

    let buildQuery = `
    SELECT * FROM Public."Users" as us
    INNER JOIN Public."BanUser" AS bu ON us.id = bu."userId" 
    `;

    //Conditions
    const conditions = [];
    let forCountVal;

    if (this.isSA(query)) {
      {
        if (query.banStatus === userBan.BANNED) {
          const condition = ` WHERE bu."isBanned" = TRUE`;
          buildQuery += condition;
          forCountVal = condition;
        }

        if (query.banStatus === userBan.NOT_BANNED) {
          const condition = ` WHERE bu."isBanned" = FALSE`;
          buildQuery += condition;
          forCountVal = condition;
        }

        if (query.banStatus === userBan.ALL) {
          const condition = ` WHERE (bu."isBanned" = TRUE OR bu."isBanned" = FALSE)`;
          buildQuery += condition;
          forCountVal = condition;
        }
      }
    } else {
      const condition = ` WHERE bu."isBanned" = FALSE`;
      buildQuery += condition;
      forCountVal = condition;
    }

    conditions.push(size);
    conditions.push(skip);

    if (query?.searchLoginTerm && query?.searchEmailTerm) {
      buildQuery += ` AND (us.login LIKE $3 OR us.email LIKE $4)`;
      const condition1 = `%${query.searchLoginTerm.toLowerCase()}%`;
      const condition2 = `%${query.searchEmailTerm.toLowerCase()}%`;
      conditions.push(condition1);
      conditions.push(condition2);
      countResult = await this.dataSource.query(
        `SELECT COUNT(*) FROM Public."Users" AS us
         INNER JOIN Public."BanUser" AS bu ON us.id = bu."userId"
         ${forCountVal} AND (us.login LIKE $1 OR us.email LIKE $2)`,
        [condition1, condition2],
      );
    } else if (query?.searchLoginTerm) {
      buildQuery += ` AND us.login LIKE $3`;
      const condition = `%${query.searchLoginTerm.toLowerCase()}%`;
      conditions.push(condition);
      countResult = await this.dataSource.query(
        `SELECT COUNT(*) FROM Public."Users" AS us
         INNER JOIN Public."BanUser" AS bu ON us.id = bu."userId"
         ${forCountVal} AND us.login LIKE $1`,
        [condition],
      );
    } else if (query?.searchEmailTerm) {
      buildQuery += ` AND us.email LIKE $3`;
      const condition = `%${query.searchEmailTerm.toLowerCase()}%`;
      conditions.push(condition);
      countResult = await this.dataSource.query(
        `SELECT COUNT(*) FROM Public."Users" AS us
        INNER JOIN Public."BanUser" AS bu ON us.id = bu."userId"
        ${forCountVal} AND us.email LIKE $1`,
        [condition],
      );
    }

    buildQuery += ` ORDER BY ${sortBy ?? '"' + 'createdAt' + '"'} ${
      sortDirection ?? SortDirection.DESC
    } `;
    buildQuery += ` LIMIT $1 `;
    buildQuery += ` OFFSET $2 `;

    const users = await this.dataSource.query(buildQuery, conditions);

    const totalCountUsers = countResult[0].count;

    const paginatedUsers = Paginated.getPaginated<UserViewModel[]>({
      items: users.map((user) => this.buildResponseUser(user)),
      page: page,
      size: size,
      count: totalCountUsers,
    });

    return paginatedUsers;
  }
}
