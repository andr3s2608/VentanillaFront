import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import { Configuration } from 'msal';

// Msal Configurations
const config: Configuration = {
  auth: {
    authority: process.env.REACT_APP_AUTHORITY,
    clientId: process.env.REACT_APP_CLIENT_ID as string,
    redirectUri: process.env.REACT_APP_REDIRECT_TO,
    postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_TO
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};

// Authentication Parameters
const authenticationParameters = {
  scopes: ['openid', 'user.read']
};

// Options
const options = {
  loginType: LoginType.Popup
};

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
