import { StatusCodes } from "http-status-codes";

export enum FileUploadSuccessResponseReasonEnum {
    Success = "Upload was successful"
}

export interface FileUploadSuccessResponse {
    message: FileUploadSuccessResponseReasonEnum;
    status: StatusCodes;
}