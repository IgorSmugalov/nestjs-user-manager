import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEvent } from 'src/events/events';
import { MailerService } from './mailer.service';
import {
  ActivationMessageDTO,
  RecoveryPassMessageDTO,
} from 'src/events/user-messages.dto';

@Injectable()
export class MailerEventListener {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent(UserEvent.signUp)
  async signUpHandler(event: ActivationMessageDTO) {
    await this.mailerService.sendActivationMessage(event);
  }

  @OnEvent(UserEvent.recoveryPassword)
  async recoveryPasswordHandler(event: RecoveryPassMessageDTO) {
    await this.mailerService.sendPasswordRecoveryMessage(event);
  }
}
