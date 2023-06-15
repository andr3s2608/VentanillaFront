import { lazy } from 'react';

// Interfaces
import { IRouteProps } from 'app/shared/components/router/access.route';

/**
 * Roles en la plataforma
 */

const rol_ciudadano = '58EDA51F-7E19-47C4-947F-F359BD1FC732';
const rol_adminFuncional = 'E18D4F05-123A-4290-A1BB-B63E8DD45FDD';
const rol_adminTI = '1073CD7C-057D-4B02-B770-A849F58FA36A';
const rol_funcionario = 'EFC7AB5B-5B58-4862-9BB1-4B1E0D7F0243';
const rol_usuarioDeshabilitado = 'C4D854A5-3654-4B1A-86CC-48535DF9B4E1';
const rol_Subdirector = '3EA40DA8-99B0-46A9-9F76-32FB5599A8E5';
const rol_medicinaLegal = '9797BE80-300F-4F18-9C71-0146AF90CB36';
const rol_coordinador = 'DAD11C31-3709-42CB-BCCE-4B52AE741935';


/** Path principal del modulo. */
export const licenciaPath = '/tramites-servicios/licencia';
export const RevisionPath = '/tramites-servicios-aguas/Revision';
export const tramiteServicePath = '/tramites-servicios';
export const tramiteServiceAguasPath = '/tramites-servicios-aguas';
export const licenciaSSTPath = '/tramites-servicios-sst/licencia/sst';
export const tramiteAdmin = '/tramites-administrador';
export const notificacion = '/notificacion';
export const updatepath = '/modificar';
export const validaciondoc = '/validardocumento';

export const tramiteServiceReport = '/reportes';

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
const ReportPage = lazy(() => import('./pages/report/reportes.page'));
const ReportesFuneraria = lazy(() => import('./pages/report/Funerarias-reportes.page'));
const SeguimientoPage = lazy(() => import('./pages/seguimiento/seguimiento.page'));
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
const ReportesAguas = lazy(() => import('../../../aguasconsumo/pages/Reportes/reportesAgua.page'));
const VisitaRevision = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/visitaRevision.page'));
const CrearSolicitud = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/CrearSolicitud.page'));
const SegundaVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/segundaVez.page'));
const RenovacionPrimeraVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/renovacionPrimera.page'));
const RenovacionSegundaVez = lazy(() => import('../../../aguasconsumo/pages/Solicitudes/renovacionSegunda.page'));

//SST
const TramiteSST = lazy(() => import('../../../sst/pages/tramite.page'));

export const LicenciaRoutes: IRouteProps[] = [

  {
    path: `${tramiteAdmin}/auditoria`,
    component: SeguimientoPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${licenciaPath}/cremacion-individual`,
    component: LicenciaCremacionIndividualPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ]
  },
  {
    path: `${licenciaPath}/gestion-inhumacion`,
    component: LicenciaPruebaPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_funcionario
    ]
  },
  {
    path: `${licenciaPath}/inhumacion-individual`,
    component: LicenciaInhumacionIndividualPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ]
  },
  {
    path: `${licenciaPath}/cremacion-fetal`,
    component: LicenciaCremacionFetalPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ],
  },
  {
    path: `${licenciaPath}/inhumacion-fetal`,
    component: LicenciaInhumacionFetalPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ]
  },
  {
    path: `${tramiteServicePath}`,
    component: MaestroPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ]
  },
  {
    path: `${tramiteServiceReport}/funeraria`,
    component: ReportesFuneraria,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${tramiteServiceReport}/rayosx`,
    component: ReportPage,
    rol: [""]
  },
  {
    path: `${tramiteAdmin}/firmas`,
    component: AdministrationFirmasPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${tramiteAdmin}/gestion-variables`,
    component: AdministrationHorarioPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${tramiteAdmin}/notificacion`,
    component: AdministrationNotificacionPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${tramiteAdmin}/reporte`,
    component: AdministrationReportePage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${updatepath}/licencia`,
    component: ModificarLicenciaPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${updatepath}/licencia-Oracle`,
    component: ModificarLicenciaOraclePage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  //cambiar tipo de licencias
  {
    path: `${updatepath}/Cambiar-Tipo-Licencia-Individual`,
    component: CambiarTipoLicenciaIndividualPage,
    rol: [
      rol_ciudadano,
      rol_medicinaLegal
    ]
  },
  {
    path: `${updatepath}/Cambiar-Tipo-Licencia-Fetal`,
    component: CambiarTipoLicenciaFetalPage,
    rol: [
      rol_ciudadano,
      rol_medicinaLegal
    ]
  },
  //actualizar datos de solicitudes
  {
    path: `${updatepath}/Actualizar-Datos-Individual`,
    component: ModificarLicenciaIndividualPage,
    rol: [
      rol_ciudadano,
      rol_medicinaLegal
    ]
  },
  {
    path: `${updatepath}/Actualizar-Datos-Fetal`,
    component: ModificarLicenciaFetalPage,
    rol: [
      rol_ciudadano,
      rol_medicinaLegal
    ]
  },
  ///////
  {
    path: `${updatepath}/funerarias`,
    component: ModificarFunerariasPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${updatepath}/cementerios`,
    component: ModificarCementeriosPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${updatepath}/medicos`,
    component: ModificarMedicosPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI
    ]
  },
  {
    path: `${validaciondoc}`,
    component: ValidarDocumentPage,
    rol: [
      rol_adminFuncional,
      rol_adminTI,
      rol_ciudadano,
      rol_funcionario,
      rol_medicinaLegal
    ]
  },
  /////////Aguas//////
  {
    path: `/reportes-aguas`,
    component: ReportesAguas,
    rol: [""]
  },
  {
    path: `${tramiteServiceAguasPath}`,
    component: BandejaAguas,
    rol: [""]
  },
  {
    path: `${RevisionPath}/revisar-solicitud`,
    component: RevisarCoordinador,
    rol: [""]
  },
  {
    path: `${RevisionPath}/gestionar-solicitud`,
    component: RevisarGestion,
    rol: [""]
  },

  {
    path: `${notificacion}`,
    component: NotificacionUsuario,
    rol: [""]
  },
  {
    path: `${notificacion}/Bandeja`,
    component: NotificacionBandeja,
    rol: [""]
  },
  {
    path: `${RevisionPath}/Crear-Solicitud`,
    component: CrearSolicitud,
    rol: [""]
  },
  {
    path: `${RevisionPath}/visita-revision`,
    component: VisitaRevision,
    rol: [""]
  },
  {
    path: `${RevisionPath}/primera-vez`,
    component: CrearSolicitud,
    rol: [""]
  },
  {
    path: `${RevisionPath}/segunda-vez`,
    component: SegundaVez,
    rol: [""]
  },
  {
    path: `${RevisionPath}/renovacion-primera-vez`,
    component: RenovacionPrimeraVez,
    rol: [""]
  },
  {
    path: `${RevisionPath}/renovacion-segunda-vez`,
    component: RenovacionSegundaVez,
    rol: [""]
  },
  // SST
  {
    path: `${licenciaSSTPath}`,
    component: TramiteSST,
    rol: [""]
  },
];
