import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { EnvService } from '../env/env.service'

@Module({
  //   imports: [EnvService],
  providers: [EnvService, { provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class StorageModule {}
