import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import { Configuration } from 'msal';

// Msal Configurations
const config: Configuration = {
  auth: {
    authority: process.env.REACT_APP_AUTHORITY,
    validateAuthority: false,
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
  scopes: ['https://saludcapitalb2c.onmicrosoft.com/f3e58d64-a12a-4db0-b982-b837f4c8325d/Ciudadano.Read']
};

// Options
const options = {
  loginType: LoginType.Popup
};

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
