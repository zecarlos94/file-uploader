export enum FileUploadFailureResponseReasonEnum {
    CouldNotUploadFiles = "Could not upload file(s)",
    ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest = "Exceeded the allowed number of file(s) that can be uploaded in a single request",
    ExceededTheAllowedNumberOfRequestsTryAgainInAFewMinutes = "Exceeded the allowed number of requests. Try again in a few minutes.",
    NoFilesToUpload = "No file(s) to upload",
    Unauthorized = "Unauthorized",
}

export interface FileUploadFailureResponse {
    reason: FileUploadFailureResponseReasonEnum;
}

