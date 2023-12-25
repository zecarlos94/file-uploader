// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths, path/no-relative-imports
import { BasicAuthFailureResponseReasonEnum } from "../common/basic-auth-failure-response.model";
import { StatusCodes } from "http-status-codes";

export enum FileUploadFailureResponseReasonEnum {
    CouldNotUploadAllFiles = "Could not upload all file(s)",
    CouldNotUploadFiles = "Could not upload file(s)",
    ExceededTheAllowedFileSize = "Exceeded the allowed file size. Try again with a smaller file",
    ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest = "Exceeded the allowed number of file(s) that can be uploaded in a single request",
    ExceededTheAllowedNumberOfRequestsTryAgainInAFewMinutes = "Exceeded the allowed number of requests. Try again in a few minutes.",
    InvalidFile = "Invalid file",
    NoFilesToUpload = "No file(s) to upload"
}

export interface FileUploadFailureResponse {
    reason: BasicAuthFailureResponseReasonEnum | FileUploadFailureResponseReasonEnum;
    status: StatusCodes
}

