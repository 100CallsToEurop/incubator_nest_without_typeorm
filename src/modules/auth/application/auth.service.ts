import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailManager } from '../infrastructure/adapters/emailManager';

@Injectable()
export class AuthService {
  constructor(private readonly emailManager: EmailManager) {}

  async sendEmailMessage(email: string, emailMessage: string): Promise<void> {
    try {
      await this.emailManager.SendMessageToEmail(email, emailMessage);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
