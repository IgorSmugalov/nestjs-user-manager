import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerEventListener } from './mailer.listener';

@Module({
  providers: [MailerService, MailerEventListener],
})
export class MailerModule {}
