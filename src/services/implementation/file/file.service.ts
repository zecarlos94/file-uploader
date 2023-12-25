import { circuitBreakerPolicy } from 'src/middlewares/common/circuit-breaker';
import { FileService } from 'src/services/interfaces/file/file.service';
import { isEmpty, isNil } from 'lodash';
import { retryPolicy } from 'src/middlewares/common/retry';
import { usePolicy, wrap } from 'cockatiel';
import config from 'src/config';
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
import logger from 'src/logger/logger';


// Create a policy that retries # times, calling through the circuit breaker
const retryWithBreaker = wrap(retryPolicy, circuitBreakerPolicy);

export class FileImplementationService implements FileService {
  @usePolicy(retryWithBreaker)
  async upload(buffer: Buffer, destination: string, filename: string, requestId: string): Promise<string | undefined> {
    if (
      !buffer || 
      isNil(destination) || 
      isEmpty(destination) ||
      isNil(filename) || 
      isEmpty(filename) ||
      isNil(requestId) || 
      isEmpty(requestId)
    ) {
      return;
    }

    const directoryPath = `./${config.files.upload.destination}`;

    if (existsSync(directoryPath)) {
      logger.debug(`Directory ${directoryPath} will not be created because already exists!`);
    } else {
      try { 
        await mkdirSync(directoryPath);
        logger.debug(`Directory ${directoryPath} created successfully!`);
      } catch (err){
        logger.error(`Directory ${directoryPath} was not created!`);
        logger.error(err);
      }
    }
    
    const filePath = `${destination}/${Date.now()}_${requestId}_${filename}`;

    const writeStream: WriteStream = createWriteStream(filePath, { flags: 'wx' });
    await this.persist(buffer, writeStream);

    return filePath;
  }

  private async persist(buffer: Buffer, writeStream: WriteStream): Promise<void> {
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
          writeStream.destroy();
          resolve();
        } else {
          writeStream.once('drain', writeChunk);
        }
      }

      writeChunk();
    });
  }
}