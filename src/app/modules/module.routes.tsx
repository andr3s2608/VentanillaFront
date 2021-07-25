import { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Component Routes
import { AccessRoute, IRouteProps } from 'app/shared/components/router/access.route';

// Antd
import Spin from 'antd/es/spin';

// Rutas
import { LicenciaRoutes } from 'app/modules/licencia/licencia.routes';

// Pages
const HomePage = lazy(() => import('./pages/module.page'));

export const ModuleRoutes = () => {
  const routesSetting: IRouteProps[] = [...LicenciaRoutes];

  return (
    <Suspense fallback={<Spin className='fadeIn app-loading' tip='Cargando Componentes...' />}>
      <Switch>
        <Route path='/' exact component={HomePage} />
        {routesSetting.map((i, idx) => (
          <AccessRoute key={idx} exact {...i} />
        ))}
        <Redirect to='/' />
      </Switch>
    </Suspense>
  );
};
