import { lazy } from 'react';

// Interfaces
import { IRouteProps } from 'app/shared/components/router/access.route';

/** Path principal del modulo. */
export const licenciaPath = '/tramites-servicios/licencia';
export const RevisionPath = '/tramites-servicios-aguas/Revision';
export const tramiteServicePath = '/tramites-servicios';
export const tramiteServiceAguasPath = '/tramites-servicios-aguas';
export const tramiteAdmin = '/tramites-administrador';
export const notificacion = '/notificacion';
export const updatepath = '/modificar';
export const validaciondoc = '/validardocumento';

export const tramiteServiceReport = '/reportes/rayosx';

// LazyLoad Pages
const LicenciaPruebaPage = lazy(() => import('./pages/gestion-tramite/gestion-inhumacion.page'));
const AdministrationFirmasPage = lazy(() => import('./pages/administracion/administracion-firmas.page'));
const AdministrationHorarioPage = lazy(() => import('./pages/administracion/administracion-horario.page'));
const ValidarDocumentPage = lazy(() => import('./pages/validacion/validaciondocumentos.page'));
//cambiar tipo de licencia usuario ciudadano
const CambiarTipoLicenciaIndividualPage = lazy(() => import('./pages/actualizacion/actualizacion-cambiolicencia-individual.page'));
const CambiarTipoLicenciaFetalPage = lazy(() => import('./pages/actualizacion/actualizacion-cambiolicencia-fetal.page'));
//modificar solicitud usuario ciudadano
const ModificarLicenciaIndividualPage = lazy(() => import('./pages/actualizacion/actualizacion-datos-individual.page'));
const ModificarLicenciaFetalPage = lazy(() => import('./pages/actualizacion/actualizacion-datos-fetal.page'));
//modificar licencias administrador
const ModificarLicenciaPage = lazy(() => import('./pages/actualizacion/actualizacion-licencia.page'));
const ModificarLicenciaOraclePage = lazy(() => import('./pages/actualizacion/actualizacion-licenciaoracle.page'));

const ModificarMedicosPage = lazy(() => import('./pages/actualizacion/actualizacion-medicos.page'));
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
//////Aguas////
const BandejaAguas = lazy(() => import('../../../aguasconsumo/pages/bandejas/RedireccionarBandeja.page'));
//-gestion
const RevisarCoordinador = lazy(() => import('../../../aguasconsumo/pages/gestion/revisionSolicitudCoordinador.page'));
const RevisarGestion = lazy(() => import('../../../aguasconsumo/pages/gestion/revisarSolicitudGestion.page'));

///notificaciones
const NotificacionUsuario = lazy(() => import('../../../aguasconsumo/pages/Notificaciones/NotificacionUsuario.page'));
const NotificacionBandeja = lazy(() => import('../../../aguasconsumo/pages/Notificaciones/NotificacionBandeja.page'));
//Solicitudes
const SolicitarRevision = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/solicitarRevision.page'));
const VisitaRevision = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/visitaRevision.page'));
const PrimeraVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/primeraVez.page'));
const SegundaVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/segundaVez.page'));
const RenovacionPrimeraVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/renovacionPrimera.page'));
const RenovacionSegundaVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/renovacionSegunda.page'));

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
    path: `${updatepath}/licencia-Oracle`,
    component: ModificarLicenciaOraclePage
  },
  //cambiar tipo de licencias
  {
    path: `${updatepath}/Cambiar-Tipo-Licencia-Individual`,
    component: CambiarTipoLicenciaIndividualPage
  },
  {
    path: `${updatepath}/Cambiar-Tipo-Licencia-Fetal`,
    component: CambiarTipoLicenciaFetalPage
  },
  //actualizar datos de solicitudes
  {
    path: `${updatepath}/Actualizar-Datos-Individual`,
    component: ModificarLicenciaIndividualPage
  },
  {
    path: `${updatepath}/Actualizar-Datos-Fetal`,
    component: ModificarLicenciaFetalPage
  },
  ///////
  {
    path: `${updatepath}/funerarias`,
    component: ModificarFunerariasPage
  },
  {
    path: `${updatepath}/cementerios`,
    component: ModificarCementeriosPage
  },
  {
    path: `${updatepath}/medicos`,
    component: ModificarMedicosPage
  },
  {
    path: `${validaciondoc}`,
    component: ValidarDocumentPage
  },
  /////////Aguas//////
  {
    path: `${tramiteServiceAguasPath}`,
    component: BandejaAguas
  },
  {
    path: `${RevisionPath}/revisar-solicitud`,
    component: RevisarCoordinador
  },
  {
    path: `${RevisionPath}/gestionar-solicitud`,
    component: RevisarGestion
  },

  {
    path: `${notificacion}`,
    component: NotificacionUsuario
  },
  {
    path: `${notificacion}/Bandeja`,
    component: NotificacionBandeja
  },
  {
    path: `${RevisionPath}/solicitar-revision`,
    component: SolicitarRevision
  },
  {
    path: `${RevisionPath}/visita-revision`,
    component: VisitaRevision
  },
  {
    path: `${RevisionPath}/primera-vez`,
    component: PrimeraVez
  },
  {
    path: `${RevisionPath}/segunda-vez`,
    component: SegundaVez
  },
  {
    path: `${RevisionPath}/renovacion-primera-vez`,
    component: RenovacionPrimeraVez
  },
  {
    path: `${RevisionPath}/renovacion-segunda-vez`,
    component: RenovacionSegundaVez
  }
];
