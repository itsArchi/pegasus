import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createPool } from 'slonik'
import type { DatabasePool } from 'slonik'

@Global()
@Module({
  providers: [
    {
      provide: 'SLONIK_POOL',
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<DatabasePool> => {
        return createPool(config.getOrThrow<string>('DATABASE_URL'))
      },
    },
  ],
  exports: ['SLONIK_POOL'],
})
export class DatabaseModule {}
