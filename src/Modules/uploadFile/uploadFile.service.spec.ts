import { Test } from '@nestjs/testing';
import { S3 } from 'aws-sdk';

import { UploadFileService } from './uploadFile.service';

describe('UploadFileService', () => {
  let uploadFileService: UploadFileService;
  let s3UploadMock: jest.Mock;

  beforeEach(async () => {
    s3UploadMock = jest.fn().mockImplementation((params, callback) => {
      callback(null, { ETag: '123456789' });
    });

    const moduleRef = await Test.createTestingModule({
      providers: [UploadFileService],
    }).compile();

    uploadFileService = moduleRef.get<UploadFileService>(UploadFileService);

    // Mock the getS3 method
    jest.spyOn(uploadFileService, 'getS3').mockReturnValue({
      upload: s3UploadMock,
    } as unknown as S3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file to S3', async () => {
    const file = {
      originalname: 'example.jpg',
      buffer: Buffer.from('file contents'),
    };

    const bucket = undefined;
    const result = await uploadFileService.upload(file);

    expect(result).toEqual({ ETag: '123456789' });

    expect(s3UploadMock).toHaveBeenCalledWith(
      {
        Bucket: bucket,
        Key: 'example.jpg',
        Body: Buffer.from('file contents'),
        ACL: 'public-read',
      },
      expect.any(Function),
    );

    // Check the actual value passed to the Bucket parameter
    const s3UploadMockCalls = s3UploadMock.mock.calls;
    const bucketParameter = s3UploadMockCalls[0][0].Bucket;
    expect(bucketParameter).toEqual(bucket);
  });
});
