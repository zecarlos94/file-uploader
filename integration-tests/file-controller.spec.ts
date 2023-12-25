import { BasicAuthFailureResponseReasonEnum } from 'src/models/common/basic-auth-failure-response.model';
import { FileUploadFailureResponseReasonEnum } from 'src/models/file/file-upload-failure-response.model';
import { FileUploadSuccessResponseReasonEnum } from 'src/models/file/file-upload-success-response.model';
import { stringify } from 'csv-stringify/sync';
import app from 'src/app';
import config from 'src/config';
import request from 'supertest';

describe('POST /file-upload', () => {
    it('responds with 401 Unauthorized due to missing required Authorization Header', () => {
        return request(app)
            .post('/file-upload')
            .expect(401)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(BasicAuthFailureResponseReasonEnum.Missing);
            });
    });

    it('responds with 401 Unauthorized due invalid credentials decoded from provided Authorization Header', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}_mock`).toString('base64');

        return request(app)
            .post('/file-upload')
            .set('Authorization', `Basic ${encodedCredentials}`)
            .expect(401)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(BasicAuthFailureResponseReasonEnum.InvalidCredentials);
            });
    });

    it('responds with 401 Unauthorized due malformed Authorization Header', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        return request(app)
            .post('/file-upload')
            .set('Authorization', `Basic ${encodedCredentials} mock`)
            .expect(401)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(BasicAuthFailureResponseReasonEnum.Malformed);
            });
    });

    it('responds with 400 Bad Request due to missing files to upload', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        return request(app)
            .post('/file-upload')
            .set('Authorization', `Basic ${encodedCredentials}`)
            .expect(400)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(FileUploadFailureResponseReasonEnum.NoFilesToUpload);
            });
    });

    it('responds with 400 "Exceeded the allowed file size. Try again with a smaller file"', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        const content: string = stringify(
            [
                [ '1', '2', '3', '4' ],
                [ 'a', 'b', 'c', 'd' ]
            ], 
            { 
                delimiter: ',' 
            }
        );
        const buffer: Buffer = Buffer.alloc(350 * 1024 * 1024, content);
        const filename: string = 'mock.csv';

        return request(app)
            .post('/file-upload')
            .attach('files', buffer, { contentType: 'text/csv', filename })
            .set('Authorization', `Basic ${encodedCredentials}`)
            .set('Content-Type', 'multipart/form-data')
            .expect(400)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(FileUploadFailureResponseReasonEnum.ExceededTheAllowedFileSize);
            });
    });

    it('responds with 400 "Invalid file"', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        const buffer1: Buffer = Buffer.from('mock 1 buffer content');
        const filename1: string = 'mock.csv';

        const buffer2: Buffer = Buffer.from('mock 2 buffer content');
        const filename2: string = 'mock2.csv';

        return request(app)
            .post('/file-upload')
            .attach('file', buffer1, { contentType: 'text/csv', filename: filename1 })
            .attach('file', buffer2, { contentType: 'text/csv', filename: filename2 })
            .set('Authorization', `Basic ${encodedCredentials}`)
            .set('Content-Type', 'multipart/form-data')
            .expect(400)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(FileUploadFailureResponseReasonEnum.InvalidFile);
            });
    });

    it('responds with 400 "Exceeded the allowed number of file(s) that can be uploaded in a single request"', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        const buffer1: Buffer = Buffer.from('mock 1 buffer content');
        const filename1: string = 'mock.csv';

        const buffer2: Buffer = Buffer.from('mock 2 buffer content');
        const filename2: string = 'mock2.csv';

        return request(app)
            .post('/file-upload')
            .attach('files', buffer1, { contentType: 'text/csv', filename: filename1 })
            .attach('files', buffer2, { contentType: 'text/csv', filename: filename2 })
            .set('Authorization', `Basic ${encodedCredentials}`)
            .set('Content-Type', 'multipart/form-data')
            .expect(400)
            .then(response => {
                const reason = response.body?.reason;

                expect(reason).toBeDefined();
                expect(reason).toBe(FileUploadFailureResponseReasonEnum.ExceededTheAllowedNumberOfFilesThatCanBeUploadedInASingleRequest);
            });
    });

    it('responds with 200 "Upload was successful"', () => {
        const password = config.authentication.basicAuth.password;
        const username = config.authentication.basicAuth.username;

        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        const content: string = stringify(
            [
                [ 'a', 'b', 'c', 'd' ]
            ], 
            { 
                delimiter: ',' 
            }
        );
        const buffer: Buffer = Buffer.alloc(50 * 1024 * 1024, content);
        const filename: string = 'mock.csv';

        return request(app)
            .post('/file-upload')
            .attach('files', buffer, { contentType: 'text/csv', filename })
            .set('Authorization', `Basic ${encodedCredentials}`)
            .set('Content-Type', 'multipart/form-data')
            .expect(200)
            .then(response => {
                const message = response.body?.message;

                expect(message).toBeDefined();
                expect(message).toBe(FileUploadSuccessResponseReasonEnum.Success);
            });
    });
});