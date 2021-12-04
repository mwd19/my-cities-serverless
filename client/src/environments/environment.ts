import { domain, clientId, serverUrl } from '../../auth_config.json';

export const environment = {
  production: false,
  auth: {
    domain,
    clientId,
    redirectUri: window.location.origin,
  },
  dev: {
    serverUrl,
  },
};
