import { Inject, OperationId, Post, Produces, Response, Route, Security, Tags, UploadedFiles } from 'tsoa';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { FileUploadFailureResponse, FileUploadFailureResponseReasonEnum } from '../../../models/file/file-upload-failure-response.model';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { FileUploadSuccessResponse } from '../../../models/file/file-upload-success-response.model';
import { FileService } from 'src/services/interfaces/file/file.service';
import { inject, injectable } from 'tsyringe';
import config from 'src/config';

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
  @Response<FileUploadSuccessResponse>('200', 'Upload was successful')
  @Response<FileUploadFailureResponse>('400', FileUploadFailureResponseReasonEnum.NoFilesToUpload)
  @Response<FileUploadFailureResponse>('401', FileUploadFailureResponseReasonEnum.Unauthorized)
  @Response<FileUploadFailureResponse>('413', FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest)
  @Response<FileUploadFailureResponse>('429', FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfRequestsTryAgainInAFewMinutes)
  @Response<FileUploadFailureResponse>('500', FileUploadFailureResponseReasonEnum.CouldNotUploadFiles)
  @Security('basic_auth')
  @Tags('Handle file uploads requests from client')
  public async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Inject() requestId: string): Promise<FileUploadSuccessResponse | FileUploadFailureResponse> {
    const uploadFilesPromises: Promise<void>[] = files?.map((file) => this.fileService.upload(
      file.buffer, 
      config.files.upload.destination, 
      file.originalname,
      requestId
    ));

    try {
      await Promise.all(uploadFilesPromises);

      return {
        message: 'Upload was successful'
      } as FileUploadSuccessResponse;
    } catch (e) {
      const errorMessage = (e as Error)?.message;

      return {
        reason: errorMessage
      } as FileUploadFailureResponse;
    }
  }
}
