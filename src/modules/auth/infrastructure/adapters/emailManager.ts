import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailManager {
  constructor(private readonly mailerService: MailerService) {}

  async SendMessageToEmail(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      html: link,
    });
  }
}
