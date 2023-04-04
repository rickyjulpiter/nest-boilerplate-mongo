import { Module } from '@nestjs/common';

import { UploadFileService } from './uploadFile.service';
import { UploadFileController } from './uploadFile.controller';

@Module({
  providers: [UploadFileService],
  controllers: [UploadFileController],
})
export class UploadFileModule {}
