import { Inject, OperationId, Post, Produces, Response, Route, Security, Tags, UploadedFiles } from 'tsoa';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { BasicAuthFailureResponseReasonEnum } from '../../../models/common/basic-auth-failure-response.model';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { FileUploadFailureResponse, FileUploadFailureResponseReasonEnum } from '../../../models/file/file-upload-failure-response.model';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { FileUploadSuccessResponse, FileUploadSuccessResponseReasonEnum } from '../../../models/file/file-upload-success-response.model';
import { FileService } from 'src/services/interfaces/file/file.service';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import config from 'src/config';
import logger from 'src/logger/logger';

/* 
 * External interfaces are defined in the models folder and tsoa won't work if imports are not relative ones 
 */

// Visit https://github.com/lukeautry/tsoa/blob/master/tests/fixtures/controllers/exampleController.ts to see more examples

@Route('file-upload')
@injectable()
export class FileController {
  constructor(@inject('FileService') private fileService: FileService) {}

  /**
   * Endpoint responsible for handling file uploads requests from client.
   * It will return a message or a reason indicating why it has failed.
   * Don't forget to add the authorization header to the request with adequate base64 encoded credentials
   * For example, if service's credentials are username: 'user' and password: '123456', then you should send the following: Authorization: Basic dXNlcjoxMjM0NTY=
   * You can use https://www.base64encode.org/ to quickly encode your credentials and https://www.base64decode.org/ to quickly decode them
   * If you don't have such credentials, you should request them from the team.
   */
  @OperationId('file-upload')
  @Post('/')
  @Produces('application/json')
  @Response<FileUploadFailureResponse>('400', FileUploadFailureResponseReasonEnum.ExceededTheAllowedFileSize)
  @Response<FileUploadFailureResponse>('400', FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest)
  @Response<FileUploadFailureResponse>('400', FileUploadFailureResponseReasonEnum.InvalidFile)
  @Response<FileUploadFailureResponse>('400', FileUploadFailureResponseReasonEnum.NoFilesToUpload)
  @Response<FileUploadFailureResponse>('401', BasicAuthFailureResponseReasonEnum.InvalidCredentials)
  @Response<FileUploadFailureResponse>('401', BasicAuthFailureResponseReasonEnum.Malformed)
  @Response<FileUploadFailureResponse>('401', BasicAuthFailureResponseReasonEnum.Missing)
  @Response<FileUploadFailureResponse>('429', FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfRequestsTryAgainInAFewMinutes)
  @Response<FileUploadFailureResponse>('500', FileUploadFailureResponseReasonEnum.CouldNotUploadAllFiles)
  @Response<FileUploadFailureResponse>('500', FileUploadFailureResponseReasonEnum.CouldNotUploadFiles)
  @Response<FileUploadSuccessResponse>('200', FileUploadSuccessResponseReasonEnum.Success)
  @Security('basic_auth')
  @Tags('Handle file uploads requests from client')
  public async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[], 
    @Inject() requestId: string
  ): Promise<FileUploadSuccessResponse | FileUploadFailureResponse> {
    if (config.files.upload.useOnlyMulter) {
      // This means that files were already uploaded to the server by multer to the desired destination automatically
      return {
        message: FileUploadSuccessResponseReasonEnum.Success,
        status: StatusCodes.OK
      } as FileUploadSuccessResponse;
    }

    if (!files || files?.length === 0) {
      return {
        reason: FileUploadFailureResponseReasonEnum.NoFilesToUpload,
        status: StatusCodes.BAD_REQUEST
      } as FileUploadFailureResponse;
    }
    
    const uploadFilesPromises: Promise<string | undefined>[] = files?.map((file) => this.fileService.upload(
      file.buffer, 
      config.files.upload.destination, 
      file.originalname,
      requestId
    ));

    try {
      const filePaths = await Promise.all(uploadFilesPromises);

      if (filePaths?.some((filePath) => !filePath)) {
        return {
          reason: FileUploadFailureResponseReasonEnum.CouldNotUploadAllFiles,
          status: StatusCodes.INTERNAL_SERVER_ERROR
        } as FileUploadFailureResponse;
      }

      return {
        message: FileUploadSuccessResponseReasonEnum.Success,
        status: StatusCodes.OK
      } as FileUploadSuccessResponse;
    } catch (e) {
      const errorMessage = (e as Error)?.message;

      logger.error(`Error while uploading files: ${errorMessage}`);

      return {
        reason: FileUploadFailureResponseReasonEnum.CouldNotUploadFiles,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      } as FileUploadFailureResponse;
    }
  }
}
