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
const RegistroNaturalPage = lazy(() => import('./pages/registro-persona'));
const RegistroJuridicoPage = lazy(() => import('./pages/registro-juridico'));
const ReportPage = lazy(() => import('./licencia/pages/report.page'));

export const ModuleRoutes = () => {
  const routesSetting: IRouteProps[] = [...LicenciaRoutes];

  return (
    <Suspense fallback={<Spin className='fadeIn app-loading' tip='Cargando Componentes...' />}>
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/registro/Natural' exact component={RegistroNaturalPage} />
        <Route path='/registro/Juridico' exact component={RegistroJuridicoPage} />
        <Route path='/report' exact component={ReportPage} />
        {routesSetting.map((i, idx) => (
          <AccessRoute key={idx} exact {...i} />
        ))}
        <Redirect to='/' />
      </Switch>
    </Suspense>
  );
};
