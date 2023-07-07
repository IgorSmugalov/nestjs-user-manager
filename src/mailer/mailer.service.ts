import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SERVER_CONFIG, SMTP_CONFIG } from 'src/config/const';
import { ISMTPConfig } from 'src/config/smtp.congfig';
import { UserDTO } from 'src/user/dto/user.dto';
import * as hbs from 'nodemailer-express-handlebars';
import { IServerConfig } from 'src/config/server.congfig';
import { join } from 'path';
import { path } from 'app-root-path';
import { EmailCanNotBeSentException } from './mailer.exceptions';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private readonly smtpConfig =
    this.configService.get<ISMTPConfig>(SMTP_CONFIG);
  private readonly serverConfig =
    this.configService.get<IServerConfig>(SERVER_CONFIG);
  private readonly logger = new Logger(this.constructor.name);
  private readonly templatesPath = join(path, '/src/mailer/templates/');
  private readonly hbsConfig = hbs({
    viewEngine: {
      layoutsDir: this.templatesPath,
      partialsDir: this.templatesPath,
      defaultLayout: '',
    },
    viewPath: this.templatesPath,
  });
  private readonly smtpTransport = nodemailer
    .createTransport({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: true,
      tls: { rejectUnauthorized: false },
      auth: { user: this.smtpConfig.user, pass: this.smtpConfig.password },
    })
    .use('compile', this.hbsConfig);

  async onModuleInit() {
    try {
      await this.smtpTransport.verify();
      this.logger.log('Server is ready to take messages');
    } catch (error) {
      this.logger.error('SMTP Error', error);
    }
  }

  public async sendActivationMessage(user: UserDTO): Promise<string> {
    const link = `${this.serverConfig.protocol}://${this.serverConfig.host}:${this.serverConfig.port}/user/email-activation-proxy/${user.activationKey}`;
    const message: Mail.Options & hbs.TemplateOptions = {
      from: 'noreply@users-app.fake',
      to: user.email,
      subject: `Activation ${user.email}`,
      template: 'confirm',
      context: { link },
    };
    let messageId: string;
    try {
      messageId = (await this.smtpTransport.sendMail(message)).messageId;
    } catch (error) {
      throw new EmailCanNotBeSentException();
    }
    return messageId;
  }
}
