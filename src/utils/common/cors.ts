import config from 'src/config';

export function getCorsAllowedOrigins() {
  const allowedDomainList = config.cors.corsDomainList;

  return !allowedDomainList || allowedDomainList === '*' ? '*' : allowedDomainList.split(',');
}
