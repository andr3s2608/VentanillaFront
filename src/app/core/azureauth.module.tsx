import React from 'react';
import { AzureAD } from 'react-aad-msal';

// Utils
import { authProvider } from '../shared/utils/authprovider.util';

// Hooks
import { useAuthProvider } from '../shared/hooks/auth.hook';

const AzureAuth = () => {
  const { bodyFunction } = useAuthProvider();
  return (
    <AzureAD provider={authProvider} forceLogin={false}>
      {bodyFunction}
    </AzureAD>
  );
};
export default AzureAuth;
