import { Request } from 'express';
import { UserAgent } from 'src/models/common/user-agent';
import { isEmpty } from 'lodash';
import logger from 'src/logger/logger';
import morgan from 'morgan';
import userAgentParser from 'ua-parser-js';

morgan.token('request_id', function getRequestId (req: Request) {
  return req.request_id;
})

function parseUserAgent(userAgent: string): UserAgent | undefined {
  let parsedUserAgent!: UserAgent;

  if (!isEmpty(userAgent)) {
    const ua = userAgentParser(userAgent);

    if (ua.browser) {
      parsedUserAgent = {
        ...(parsedUserAgent || {}),
        userAgentBrowserName: ua.browser.name,
        userAgentBrowserVersion: ua.browser.version,
      };
    }

    if (ua.os) {
      parsedUserAgent = {
        ...(parsedUserAgent || {}),
        userAgentOsName: ua.os.name,
        userAgentOsVersion: ua.os.version,
      };
    }
  }

  return parsedUserAgent;
}

const morganJSONFormat = () => JSON.stringify({
  content_length: ':res[content-length]',
  http_version: ':http-version',
  method: ':method',
  referrer: ':referrer',
  remote_addr: ':remote-addr',
  request_id: ':request_id',
  response_time: ':response-time',
  status: ':status',
  url: ':url',
  user_agent: ':user-agent',
});

export const morganLoggerMiddleware = morgan(
  morganJSONFormat(), 
  {
    stream: { 
      write: (message: string) => {
        const parsedMessage = JSON.parse(message.trim());

        const parsedUserAgent = parseUserAgent(parsedMessage?.user_agent);

        const httpMessageParcels = [
          `[request id: ${parsedMessage?.request_id}] ${parsedMessage?.method} ${parsedMessage?.url} ${parsedMessage?.status}`,
          `took ${parsedMessage?.response_time}ms`
        ];

        if (!isEmpty(parsedMessage?.referrer)) {
          httpMessageParcels.push(
            `from referrer ${parsedMessage?.referrer}`
          );
        }

        if (!isEmpty(parsedMessage?.remote_addr)) {
          httpMessageParcels.push(
            `from remote address ${parsedMessage?.remote_addr}`
          );
        }
                
        if (!isEmpty(parsedMessage?.http_version)) {
          httpMessageParcels.push(
            `with http version ${parsedMessage?.http_version}`
          );
        }

        if (!isEmpty(parsedMessage?.content_length)) {
          httpMessageParcels.push(
            `with content length ${parsedMessage?.content_length}`
          );
        }

        if (
          !isEmpty(parsedUserAgent?.userAgentBrowserName)
        ) {
          httpMessageParcels.push(
            `with user agent browser name: ${parsedUserAgent?.userAgentBrowserName ?? ''}`,
          );
        }

        if (
          !isEmpty(parsedUserAgent?.userAgentBrowserVersion)
        ) {
          httpMessageParcels.push(
            `with user agent browser version: ${parsedUserAgent?.userAgentBrowserVersion ?? ''}`,
          );
        }

        if (
          !isEmpty(parsedUserAgent?.userAgentOsName)
        ) {
          httpMessageParcels.push(
            `with user agent os name: ${parsedUserAgent?.userAgentOsName ?? ''}`,
          );
        }

        if (
          !isEmpty(parsedUserAgent?.userAgentOsVersion)
        ) {
          httpMessageParcels.push(
            `with user agent os version: ${parsedUserAgent?.userAgentOsVersion ?? ''}`,
          );
        }

        logger.http(httpMessageParcels.join(' '));
      }
    }
  }
);