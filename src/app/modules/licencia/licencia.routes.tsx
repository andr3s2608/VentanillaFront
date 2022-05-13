import { lazy } from 'react';

// Interfaces
import { IRouteProps } from 'app/shared/components/router/access.route';

/** Path principal del modulo. */
export const licenciaPath = '/tramites-servicios/licencia';
export const tramiteServicePath = '/tramites-servicios';
export const tramiteAdmin = '/tramites-administrador';
export const updatepath = '/modificar';
export const tramiteServiceReport = '/reportes/rayosx';

// LazyLoad Pages
const LicenciaPruebaPage = lazy(() => import('./pages/gestion-tramite/gestion-inhumacion.page'));
const AdministrationFirmasPage = lazy(() => import('./pages/administracion/administracion-firmas.page'));
const AdministrationHorarioPage = lazy(() => import('./pages/administracion/administracion-horario.page'));
const ModificarLicenciaPage = lazy(() => import('./pages/actualizacion/actualizacion-licencia.page'));
const ModificarCementeriosPage = lazy(() => import('./pages/actualizacion/actualizacion-cementerios.page'));
const ModificarFunerariasPage = lazy(() => import('./pages/actualizacion/actualizacion-funerarias.page'));
const AdministrationNotificacionPage = lazy(() => import('./pages/administracion/administracion-notificaciones.page'));
const AdministrationReportePage = lazy(() => import('./pages/administracion/administracion-reportes.page'));
const LicenciaCremacionIndividualPage = lazy(() => import('./pages/cremacion-individual/cremacion-individual.page'));
const LicenciaInhumacionIndividualPage = lazy(() => import('./pages/inhumacion-individual/inhumacion-individual.page'));
const LicenciaCremacionFetalPage = lazy(() => import('./pages/cremacion-fetal/cremacion-fetal.page'));
const LicenciaInhumacionFetalPage = lazy(() => import('./pages/inhumacion-fetal/inhumacion-fetal.page'));
const MaestroPage = lazy(() => import('./pages/GridTipoLicencia/GridTipoLicencia.page'));
const ReportPage = lazy(() => import('./pages/report/report.page'));

export const LicenciaRoutes: IRouteProps[] = [
  {
    path: `${licenciaPath}/cremacion-individual`,
    component: LicenciaCremacionIndividualPage
  },
  {
    path: `${licenciaPath}/gestion-inhumacion`,
    component: LicenciaPruebaPage
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
  },
  {
    path: `${tramiteServiceReport}`,
    component: ReportPage
  },
  {
    path: `${tramiteAdmin}/firmas`,
    component: AdministrationFirmasPage
  },
  {
    path: `${tramiteAdmin}/horario`,
    component: AdministrationHorarioPage
  },
  {
    path: `${tramiteAdmin}/notificacion`,
    component: AdministrationNotificacionPage
  },
  {
    path: `${tramiteAdmin}/reporte`,
    component: AdministrationReportePage
  },
  {
    path: `${updatepath}/licencia`,
    component: ModificarLicenciaPage
  },
  {
    path: `${updatepath}/funerarias`,
    component: ModificarFunerariasPage
  },
  {
    path: `${updatepath}/cementerios`,
    component: ModificarCementeriosPage
  }
];
