import { Module } from '@nestjs/common';
import { TokensService } from './application/tokens.service';

@Module({
  providers: [TokensService]
})
export class TokensModule {}
