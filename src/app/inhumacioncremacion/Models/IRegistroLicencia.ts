export interface IRegistroLicencia<T> {
  solicitud: Solicitud<T>;
}

export interface Solicitud<T> {
  idSolicitud?: string;
  consecutivo: string;
  numeroCertificado: string;
  fechaDefuncion: string;
  sinEstablecer: boolean;
  hora: string | null;
  idSexo: string;
  estadoSolicitud: string | undefined;
  idPersonaVentanilla: number;
  idUsuarioSeguridad: string;
  idTramite?: string;
  idTipoMuerte: string;
  tipoPersona: string;
  tipoIdentificacionSolicitante: string;
  noIdentificacionSolicitante: string;
  razonSocialSolicitante: string;
  persona: T;
  lugarDefuncion: LugarDefuncion;
  ubicacionPersona: UbicacionPersona;
  datosCementerio: DatosCementerio;
  datosFuneraria: DatosFuneraria;
  resumenSolicitud: ResumenSolicitud;
  institucionCertificaFallecimiento: InstitucionCertificaFallecimiento;
  //documentosSoporte: DocumentosSoporte[];
}

export interface DatosCementerio {
  idDatosCementerio?: string;
  enBogota: boolean;
  fueraBogota: boolean;
  fueraPais: boolean;
  cementerio: string;
  otroSitio: string;
  ciudad: string;
  idPais: string;
  idDepartamento: string;
  idMunicipio: string;
}

export interface DatosFuneraria {
  idDatosFuneraria?: string;
  enBogota: boolean;
  fueraBogota: boolean;
  fueraPais: boolean;
  funeraria: string;
  otroSitio: string;
  ciudad: string;
  idPais: string;
  idDepartamento: string;
  idMunicipio: string;
}
export interface ResumenSolicitud {
  idSolicitud?: string;
  correoCementerio: string;
  correoFuneraria: string;
  tipoDocumentoSolicitante: string;
  numeroDocumentoSolicitante: string;
  nombreSolicitante: string;
  apellidoSolicitante: string;
  correoSolicitante: string;
  correoMedico: string;
  cumpleCausa: boolean;
  observacionCausa: string;
  numeroLicencia?: string;
}

export interface DocumentosSoporte {
  idSolicitud?: string;
  idTipoDocumentoSoporte: string;
  path?: string;
  fechaRegistro: string;
  fechaModificacion?: string;
  idUsuario: string;
}

export interface InstitucionCertificaFallecimiento {
  idInstitucionCertificaFallecimiento?: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  razonSocial: string;
  numeroProtocolo: string;
  numeroActaLevantamiento: string;
  fechaActa: string | null;
  seccionalFiscalia: string;
  noFiscal: string;
  idTipoInstitucion: string;
  NombreFiscal: string;
  ApellidoFiscal: string;
  NumeroOficio: string;
  FechaOficio: string | null;
  NoFiscalMedicinaLegal: string;
}

export interface LugarDefuncion {
  idLugarDefuncion?: string;
  idPais: string;
  idDepartamento: string;
  idMunicipio: string;
  idAreaDefuncion: string;
  idSitioDefuncion: string;
}
export interface Solicitante {
  tipoDocumento?: string;
  idPais: string;
  idDepartamento: string;
  idMunicipio: string;
  idAreaDefuncion: string;
  idSitioDefuncion: string;
}

export interface Persona {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  segundanacionalidad: string;
  otroParentesco: string;
  estado: boolean;
  idEstadoCivil: string;
  idNivelEducativo: string;
  idEtnia: string;
  idRegimen: string;
  idTipoPersona: string;
  idSolicitud: string;
  idParentesco: string;
  idLugarExpedicion: string;
  idTipoProfesional: string;
  idUbicacionPersona: string;
}

export interface UbicacionPersona {
  idUbicacionPersona?: string;
  idPaisResidencia: string;
  idDepartamentoResidencia: string;
  idCiudadResidencia: string;
  idLocalidadResidencia: string;
  idAreaResidencia: string;
  idBarrioResidencia: string;
  ciudad: string;
}
