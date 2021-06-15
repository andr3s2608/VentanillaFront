import React from 'react';
import { useHistory } from 'react-router';

// Antd
import Result from 'antd/es/result';
import Button from 'antd/es/button';

export const NoAuthorizedPage = () => {
  const {
    goBack,
    location: { pathname }
  } = useHistory();

  return (
    <Result
      status='403'
      title='Acceso Denegado - No Autorizado'
      subTitle={
        <p>
          Lo sentimos, usted no esta autorizado para ingresar en la ruta <b>{pathname}</b>.<br />
          Si requiere acceder a esta ruta, póngase en contacto con el administrador de permisos y le conceda el acceso a este
          módulo.
        </p>
      }
      extra={
        <Button type='primary' onClick={goBack}>
          Volver atrás
        </Button>
      }
    />
  );
};
