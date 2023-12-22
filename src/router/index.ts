import 'reflect-metadata';
import { basicAuthAuthenticatorMiddleware } from 'src/middlewares/common/basic-auth-authenticator';
import { container } from 'tsyringe';
import { DynamicRateLimiter } from 'src/utils/common/dynamic-rate-limiter';
import { FileController } from 'src/router/controllers/file/file.controller';
import { FileUploadFailureResponse } from 'src/models/file/file-upload-failure-response.model';
import { FileUploadSuccessResponse } from 'src/models/file/file-upload-success-response.model';
import { multipleFilesUploadsMiddleware } from 'src/middlewares/common/file-upload';
import { StatusCodes } from 'http-status-codes';
import config from 'src/config';
import express from 'express';

const router = express.Router();

router.post(
  '/file-upload', 
  DynamicRateLimiter.get(),
  (req, res, next) => multipleFilesUploadsMiddleware(req, res, next),
  (req, res, next) => basicAuthAuthenticatorMiddleware(req, res, next),
  async (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files?.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ reason: 'No file(s) to upload' });
    }

    if (config.files.upload.useOnlyMulter) {
      return res
        .status(StatusCodes.OK)
        .send({ message: "Upload was successful" });
    }
    
    const fileController: FileController = container.resolve(FileController);

    try {
      const fileUploadResponse: FileUploadFailureResponse | FileUploadSuccessResponse = await fileController.uploadFiles(files, req.request_id);
      
      return res
        .status(StatusCodes.OK)
        .send(fileUploadResponse);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ reason: 'Could not upload file(s)' });
    }
  }
);

export default router;
