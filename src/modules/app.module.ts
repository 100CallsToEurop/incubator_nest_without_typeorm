import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TestingModule } from './testing/testing.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../configs/typeorm.config';


@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    AuthModule,
    TestingModule,
    SecurityDevicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
