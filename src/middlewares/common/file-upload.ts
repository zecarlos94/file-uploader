import { NextFunction, Request, Response } from 'express';
import bytes from "bytes";
import config from "src/config";
import fs from 'fs';
import multer, { diskStorage, FileFilterCallback, Multer, MulterError, StorageEngine } from 'multer';
import { StatusCodes } from 'http-status-codes';
import { FileUploadFailureResponseReasonEnum } from 'src/models/file/file-upload-failure-response.model';

const multerFilter = (
    request: Request, 
    file: Express.Multer.File, 
    callback: FileFilterCallback
): void => {
    const allowedMimeTypes: string[] = config.files.upload.allowedMimeTypes.split(",");

    const mimeType = file.mimetype.split("/")[1];

    if (allowedMimeTypes.includes(mimeType)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type, check if file is one of the accepted types: ${config.files.upload.allowedMimeTypes}!`));
    }
};

const multerDiskStorage: StorageEngine = diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(config.files.upload.destination, { recursive: true });
        cb(null, config.files.upload.destination);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${req.request_id}_${file.originalname}`);
    },
});

const multerMemoryStorage: StorageEngine = multer.memoryStorage();

const fileUpload: Multer = multer({
    fileFilter: multerFilter,
    limits: {
        fields: 0,
        files: config.files.upload.maxFilesPerRequest,
        fileSize: bytes.parse(config.files.upload.maxFileSize),
    },
    storage: config.files.upload.useOnlyMulter ? multerDiskStorage : multerMemoryStorage,
});

const multipleFilesUploads = fileUpload.array("files", config.files.upload.maxFilesPerRequest);

export const multipleFilesUploadsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    multipleFilesUploads(req, res, (err) => {
        if (err instanceof MulterError) {
            switch (err.code) {
                case 'LIMIT_FIELD_COUNT':
                case 'LIMIT_FILE_COUNT':
                    return res
                        .status(StatusCodes.REQUEST_TOO_LONG)
                        .send({ reason: FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest });
                case 'LIMIT_FILE_SIZE':
                case 'LIMIT_UNEXPECTED_FILE':
                default:
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send({ reason: FileUploadFailureResponseReasonEnum.CouldNotUploadFiles });
            }
        }

        next();
   });
};