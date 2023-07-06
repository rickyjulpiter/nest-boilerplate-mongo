import { Test } from '@nestjs/testing';
import { UploadFileModule } from './uploadFile.module';
import { UploadFileService } from './uploadFile.service';
import { UploadFileController } from './uploadFile.controller';

describe('UploadFileModule', () => {
  let uploadFileService: UploadFileService;
  let uploadFileController: UploadFileController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UploadFileModule],
    }).compile();

    uploadFileService = moduleRef.get<UploadFileService>(UploadFileService);
    uploadFileController =
      moduleRef.get<UploadFileController>(UploadFileController);
  });

  it('should be defined', () => {
    expect(uploadFileService).toBeDefined();
    expect(uploadFileController).toBeDefined();
  });
});
