import { domain, clientId, serverUrl } from '../../auth_config.json';

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    redirectUri: window.location.origin,
  },
  dev: {
    serverUrl,
  },
};
