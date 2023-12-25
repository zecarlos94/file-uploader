import 'reflect-metadata';
import { basicAuthAuthenticatorMiddleware } from 'src/middlewares/common/basic-auth-authenticator';
import { container } from 'tsyringe';
import { DynamicRateLimiter } from 'src/utils/common/dynamic-rate-limiter';
import { FileController } from 'src/router/controllers/file/file.controller';
import { FileUploadFailureResponse } from 'src/models/file/file-upload-failure-response.model';
import { FileUploadSuccessResponse } from 'src/models/file/file-upload-success-response.model';
import { multipleFilesUploadsMiddleware } from 'src/middlewares/common/file-upload';
import { omit } from 'lodash';
import express from 'express';

const router = express.Router();

router.post(
  '/file-upload', 
  DynamicRateLimiter.get(),
  (req, res, next) => multipleFilesUploadsMiddleware(req, res, next),
  (req, res, next) => basicAuthAuthenticatorMiddleware(req, res, next),
  async (req, res) => {
    const fileController: FileController = container.resolve(FileController);

    const fileUploadResponse: FileUploadFailureResponse | FileUploadSuccessResponse = await fileController.uploadFiles(
      req.files as Express.Multer.File[], 
      req.request_id
    );

    return res
      .status(fileUploadResponse.status)
      .send(omit(fileUploadResponse, 'status'));
  }
);

export default router;
