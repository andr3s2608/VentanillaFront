import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Component Routes
import { AccessRoute, IRouteProps } from 'app/shared/components/router/access.route';

// Antd
import Spin from 'antd/es/spin';

// Rutas
import { LicenciaRoutes } from 'app/inhumacioncremacion/modules/licencia/licencia.routes';

// Pages
const HomePage = lazy(() => import('./pages/module.page'));
const RegistroNaturalPage = lazy(() => import('./pages/registro-persona'));
const RegistroJuridicoPage = lazy(() => import('./pages/registro-juridico'));

export const ModuleRoutes = () => {
  const routesSetting: IRouteProps[] = [...LicenciaRoutes];

  let infouser: any = localStorage.getItem('infouser');
  let user = JSON.parse(infouser);
  let roles: any = localStorage.getItem('roles');
  let rol = JSON.parse(roles);


  return (
    <Suspense fallback={<Spin className='fadeIn app-loading' tip='Cargando Componentes...' />}>
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/registro/Natural' exact component={RegistroNaturalPage} />
        <Route path='/registro/Juridico' exact component={RegistroJuridicoPage} />
        {
          rol != undefined ? routesSetting.map((i, idx) => (
            (i.rol.includes(rol[0].codigoRol.toUpperCase()) || i.rol.includes("")) ? < AccessRoute key={idx} exact {...i} /> : null
          )) : console.log("")
        }
        <Redirect to='/' />
      </Switch>
    </Suspense>
  );
};
