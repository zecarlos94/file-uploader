export interface FileService {
    upload(buffer: Buffer, destination: string, filename: string, requestId: string): Promise<string | undefined>;
}