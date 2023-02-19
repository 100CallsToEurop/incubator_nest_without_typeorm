import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TestingModule } from './testing/testing.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../configs/typeorm.config';
import { TokensModule } from './tokens/tokens.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from '../configs/mailer.config';
import { AtStrategy } from '../common/strategies/jwt.strategy';
import { BasicStrategy } from '../common/strategies/basic.stratefy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RtStrategy } from '../common/strategies/jwt.refresh.strategy';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MailerModule.forRootAsync(getMailerConfig()),
    //AuthModule,
    TestingModule,
    //SecurityDevicesModule,
    //TokensModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
   // AtStrategy,
  //  RtStrategy,
    BasicStrategy,
   // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
