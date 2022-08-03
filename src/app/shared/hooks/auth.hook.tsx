import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { AuthenticationState, IAzureADFunctionProps } from 'react-aad-msal';

// Antd
import Spin from 'antd/es/spin';

// Pages
import { LoginPage } from 'app/core/pages/login.page';

// Modules
import { ModuleLayout } from 'app/inhumacioncremacion/modules/module.layout';

export const useAuthProvider = () => {
  const bodyFunction = (dataFunction: IAzureADFunctionProps) => {
    const { login, logout, authenticationState, error, accountInfo } = dataFunction;

    switch (authenticationState) {
      case AuthenticationState.Authenticated:
        localStorage.setItem('accountInfoStorage', JSON.stringify(accountInfo));
        return (
          <BrowserRouter>
            <Route path='/'>
              <ModuleLayout logout={logout} />
            </Route>
          </BrowserRouter>
        );

      case AuthenticationState.Unauthenticated:
        return (
          <BrowserRouter>
            <Route path='/' exact>
              <LoginPage login={login} />
            </Route>
            <Redirect from='**' to='/' />
          </BrowserRouter>
        );

      case AuthenticationState.InProgress:
        return (
          <>
            <Spin className='fadeIn app-loading' tip='Autenticando inicio de sesión' />
            <LoginPage login={login} />
          </>
        );
    }
  };

  return {
    bodyFunction
  };
};
