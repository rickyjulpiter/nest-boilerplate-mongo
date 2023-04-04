import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  HttpStatus,
  Logger,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UploadFileService } from './uploadFile.service';
import Helpers from '../../Helpers/helpers';

@Controller('upload')
export class UploadFileController {
  private readonly helpers = new Helpers();

  constructor(private readonly service: UploadFileService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload file to AWS S3',
    description: '',
    tags: ['Upload File'],
  })
  async upload(@UploadedFile() file, @Res() res) {
    try {
      const image = await this.service.upload(file);
      Logger.log('Image uploaded');
      return this.helpers.response(res, HttpStatus.CREATED, '', image.Location);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
