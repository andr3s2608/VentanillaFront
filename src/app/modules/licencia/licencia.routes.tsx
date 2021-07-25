import { lazy } from 'react';

// Interfaces
import { IRouteProps } from 'app/shared/components/router/access.route';

/** Path principal del modulo. */
export const licenciaPath = '/tramites-servicios/licencia';
export const tramiteServicePath = '/tramites-servicios';

// LazyLoad Pages
const LicenciaCremacionIndividualPage = lazy(() => import('./pages/cremacion-individual/cremacion-individual.page'));
const LicenciaInhumacionIndividualPage = lazy(() => import('./pages/inhumacion-individual/inhumacion-individual.page'));
const LicenciaCremacionFetalPage = lazy(() => import('./pages/cremacion-fetal/cremacion-fetal.page'));
const LicenciaInhumacionFetalPage = lazy(() => import('./pages/inhumacion-fetal/inhumacion-fetal.page'));
const MaestroPage = lazy(() => import('./pages/GridTipoLicencia/GridTipoLicencia.page'));

export const LicenciaRoutes: IRouteProps[] = [
  {
    path: `${licenciaPath}/cremacion-individual`,
    component: LicenciaCremacionIndividualPage
  },
  {
    path: `${licenciaPath}/inhumacion-individual`,
    component: LicenciaInhumacionIndividualPage
  },
  {
    path: `${licenciaPath}/cremacion-fetal`,
    component: LicenciaCremacionFetalPage
  },
  {
    path: `${licenciaPath}/inhumacion-fetal`,
    component: LicenciaInhumacionFetalPage
  },
  {
    path: `${tramiteServicePath}`,
    component: MaestroPage
  }
];
