import { FileImplementationService } from 'src/services/implementation/file/file.service';
import { promises as fs } from "fs";
import config from 'src/config';
import crypto from 'crypto';
import rmfr from 'rmfr';


describe('file service', () => {
  let fileService: FileImplementationService;

  afterAll(async () => {
    await rmfr(config.files.upload.destination)
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    fileService = new FileImplementationService();
  });
    
  it(
    'upload should be return file path that contains provided requestId and filename inside provided destination folder name', 
    async () => {
      // arrange
      const buffer: Buffer = Buffer.from('mock buffer content'); 
      const destination: string = config.files.upload.destination; 
      const filename: string = 'mock.csv';
      const now: number = Date.now();
      const requestId: string = crypto.randomUUID();

      const spyInstance = jest
        .spyOn(fileService, 'upload')
        .mockImplementation(async () => Promise.resolve(`${destination}/${now}_${requestId}_${filename}`));

      // act
      const filePath = await fileService.upload(buffer, destination, filename, requestId);

      // assert
      expect(spyInstance).toHaveBeenCalledTimes(1);
      expect(filePath).toBeDefined();
      expect(filePath).toBe(`${destination}/${now}_${requestId}_${filename}`);
    }
  );

  it(
    'upload should not persist in destination folder any file due to empty arguments', 
    async () => {
      // arrange
      const buffer: Buffer = Buffer.from('mock buffer content'); 

      // act
      const filePath = await fileService.upload(buffer, '', '', '');
      
      // assert
      expect(filePath).not.toBeDefined();
    }
  );

  it(
    'upload should be persist in destination folder file "mock.csv" with "mock buffer content"', 
    async () => {
      // arrange
      const buffer: Buffer = Buffer.from('mock buffer content'); 
      const destination: string = config.files.upload.destination; 
      const filename: string = 'mock.csv';
      const requestId: string = crypto.randomUUID();

      // act
      const filePath = await fileService.upload(buffer, destination, filename, requestId);

      let files: string[] = await fs.readdir(destination);
      const fileRegex = new RegExp(`_${requestId}_${filename}`);
      let hasFile = files.some((file: string) => fileRegex.test(file));

      // assert
      expect(filePath).toBeDefined();
      expect(files).toBeDefined();
      expect(files).toHaveLength(1);
      expect(hasFile).toBeTruthy();
    }
  );
});
