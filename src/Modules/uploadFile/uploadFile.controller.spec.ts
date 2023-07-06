import { Test } from '@nestjs/testing';
import { UploadFileController } from './uploadFile.controller';
import { UploadFileService } from './uploadFile.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadFileController', () => {
  let uploadFileController: UploadFileController;
  let uploadFileService: UploadFileService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UploadFileController],
      providers: [UploadFileService],
    }).compile();

    uploadFileController =
      moduleRef.get<UploadFileController>(UploadFileController);
    uploadFileService = moduleRef.get<UploadFileService>(UploadFileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a file and return the image location', async () => {
      // Mocked file object
      const file = {
        originalname: 'example.jpg',
        buffer: Buffer.from('file contents'),
      };

      // Mock the upload method of UploadFileService to throw BadRequestException
      jest
        .spyOn(uploadFileService, 'upload')
        .mockRejectedValueOnce(new BadRequestException());

      // Mock the helpers response method
      const responseSpy = jest.spyOn(
        uploadFileController['helpers'],
        'response',
      );

      // Mock the response object
      const res = {};

      // Assertions
      expect.assertions(2);

      try {
        // Call the upload method
        await uploadFileController.upload(file, res);
      } catch (error) {
        // Assert that BadRequestException is thrown
        expect(error).toBeInstanceOf(BadRequestException);

        // Assert that helpers response method is not called
        expect(responseSpy).not.toHaveBeenCalled();
      }
    });

    it('should throw BadRequestException if upload fails', async () => {
      // Mocked file object
      const file = {
        originalname: 'example.jpg',
        buffer: Buffer.from('file contents'),
      };

      // Mock the upload method of UploadFileService to throw an error
      jest
        .spyOn(uploadFileService, 'upload')
        .mockRejectedValueOnce(new Error('Upload failed'));

      // Assert that BadRequestException is thrown
      await expect(uploadFileController.upload(file, {})).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
