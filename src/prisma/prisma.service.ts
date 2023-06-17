import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HashService } from 'src/crypto/hash.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private hash: HashService) {
    super();
  }
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await this.connectToDB();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private async connectToDB() {
    let connected = false;
    let retry = 1;
    while (!connected) {
      try {
        await this.$connect();
        connected = true;
        this.logger.log('Successfully connected to database');
      } catch (error) {
        if (retry > 3) {
          this.logger.error(
            `Connecting to database failed after ${retry - 1} tries`,
          );
          throw new Error(error.message);
        }
        this.logger.error(error);
        this.logger.error(`Connecting to database, retry number ${retry}`);

        await new Promise((res) => setTimeout(res, 3000));
        retry++;
      }
    }
  }
}
