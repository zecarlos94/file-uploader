import { circuitBreakerPolicy } from 'src/middlewares/common/circuit-breaker';
import { FileService } from 'src/services/interfaces/file/file.service';
import { retryPolicy } from 'src/middlewares/common/retry';
import { usePolicy, wrap } from 'cockatiel';
import config from 'src/config';
import fs, { WriteStream } from 'fs';

// Create a policy that retries # times, calling through the circuit breaker
const retryWithBreaker = wrap(retryPolicy, circuitBreakerPolicy);

export class FileImplementationService implements FileService {
  @usePolicy(retryWithBreaker)
  async upload(buffer: Buffer, destination: string, filename: string, requestId: string): Promise<void> {
    fs.mkdirSync(config.files.upload.destination, { recursive: true });

    const writeStream: WriteStream = fs.createWriteStream(`${destination}/${Date.now()}_${requestId}_${filename}`, { flags: 'wx' });
    await this.persist(buffer, writeStream);
  }

  private async persist(buffer: Buffer, writeStream: WriteStream,): Promise<void> {
    const chunkSize = 1024;

    let offset = 0;

    return new Promise((resolve) => {
      const writeChunk = () => {
        let canWriteNextChunk = true;

        while (offset < buffer.length && canWriteNextChunk) {
          const chunk = buffer.subarray(offset, offset + chunkSize);

          canWriteNextChunk = writeStream.write(chunk);

          offset += chunkSize;
        }

        if (offset >= buffer.length) {
          writeStream.end();
          resolve();
        } else {
          writeStream.once('drain', writeChunk);
        }
      }

      writeChunk();
    });
  }
}