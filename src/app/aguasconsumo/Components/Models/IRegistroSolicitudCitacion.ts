export interface IRegistroSolicitud<T> {
  solicitud: Solicitud<T>;
}

export interface Solicitud<T> {
  idSolicitud?: string;
  idPersona?: string;
  idTipodeSolicitud?: string;
  tipodeSolicitud: string;
  numeroRadicado: number;
  fechaSolicitud: string;
  idEstado?: string;
  estado: string;
  idFuente?: string;
  idUbicacion?: string;
  idSubred: string;
  idActividadActualSolicitud?: string;
  actividadActualSolicitud: string;
  actividadSiguienteSolicitud?: string;

  idTipodeTramite?: string;
  tipodeTramite: string;
  idUsuario?: string;
  idCitacionRevision?: string;

  idFuenteAbastecimiento?: string;
  temporal: boolean;

  persona: Persona;
  ubicacion: UbicacionPersona;

  citacion_Revision: Citacion_Revision;
}
export interface Persona {
  idPersona?: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefonoContacto: string;
  celularContacto: string;
  correoElectronico: string;
  idTipoPersona: string;
  tipoDocumentoRazon: string;
  nit: string;
  razonSocial: string;
}

export interface UbicacionPersona {
  direccion: string;
  departamento?: string;
  municipio?: string;
  localidad?: string;
  vereda?: string;
  sector?: string;
  upz?: string;
  barrio?: string;
  observacion?: string;
}

export interface Citacion_Revision {
  idCitacion?: string;
  fechaCitacion: string;
  observacion: string;
  fechaRegistro: string;
  idSolicitud: string;
}
