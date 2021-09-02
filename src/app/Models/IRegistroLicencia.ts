export interface IRegistroLicencia<T> {
  solicitud: Solicitud<T>;
}

export interface Solicitud<T> {
  numeroCertificado: string;
  fechaDefuncion: string;
  sinEstablecer: boolean;
  hora: string | null;
  idSexo: string;
  estadoSolicitud: string | undefined;
  idPersonaVentanilla: number;
  idUsuarioSeguridad: string;
  idTramite: string;
  idTipoMuerte: string;
  persona: T;
  lugarDefuncion: LugarDefuncion;
  ubicacionPersona: UbicacionPersona;
  datosCementerio: DatosCementerio;
  institucionCertificaFallecimiento: InstitucionCertificaFallecimiento;
  //documentosSoporte: DocumentosSoporte[];
}

export interface DatosCementerio {
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

export interface DocumentosSoporte {
  idSolicitud?: string;
  idTipoDocumentoSoporte: string;
  path?: string;
  fechaRegistro: string;
  fechaModificacion?: string;
  idUsuario: string;
}

export interface InstitucionCertificaFallecimiento {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  razonSocial: string;
  numeroProtocolo: string;
  numeroActaLevantamiento: string;
  fechaActa: string;
  seccionalFiscalia: string;
  noFiscal: string;
  idTipoInstitucion: string;
}

export interface LugarDefuncion {
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
  idPaisResidencia: string;
  idDepartamentoResidencia: string;
  idCiudadResidencia: string;
  idLocalidadResidencia: string;
  idAreaResidencia: string;
  idBarrioResidencia: string;
}
