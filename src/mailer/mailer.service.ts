import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SMTP_CONFIG } from 'src/config/const';
import { ISMTPConfig } from 'src/config/smtp.congfig';
import { UserDTO } from 'src/user/dto/user.dto';
import { EmailCanNotBeSentException } from './mailer.exceptions';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}
  private readonly config = this.configService.get<ISMTPConfig>(SMTP_CONFIG);
  private readonly logger = new Logger(this.constructor.name);
  private readonly smtpTransport = nodemailer.createTransport({
    host: this.config.host,
    port: this.config.port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: this.config.user, pass: this.config.password },
  });

  async onModuleInit() {
    try {
      await this.smtpTransport.verify();
      this.logger.log('Server is ready to take messages');
    } catch (error) {
      this.logger.error('SMTP Error', error);
    }
  }

  public async sendHelloMessage(
    user: UserDTO,
    messageText: string,
  ): Promise<string> {
    const message: Mail.Options = {
      from: 'noreply@usersapp.fake',
      to: user.email,
      subject: `Hello, ${user.email}`,
      html: `<p>${messageText}</p>`,
    };
    let messageId: string;
    try {
      messageId = (await this.smtpTransport.sendMail(message)).messageId;
    } catch {
      throw new EmailCanNotBeSentException();
    }
    return messageId;
  }

  public async sendActivationMessage(user: UserDTO): Promise<string> {
    const message: Mail.Options = {
      from: 'noreply@usersapp.fake',
      to: user.email,
      subject: `Activation ${user.email}`,
      html: `<p>${user.activationKey}</p>`,
    };
    let messageId: string;
    try {
      messageId = (await this.smtpTransport.sendMail(message)).messageId;
    } catch {
      throw new EmailCanNotBeSentException();
    }
    return messageId;
  }
}
