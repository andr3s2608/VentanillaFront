export interface RequestSolicitudDTO {
  idTipoTramite: string;
  idTipoSolicitud: string;
  idUsuario: string;
  temporal: boolean;
  persona: Persona;
  ubicacion: Ubicacion;
}

export interface ResponseSolicitudDTO {
  idSolicitud: string;
  idPersona: string;
  numeroRadicado: number;
  fechaSolicitud: Date;
}

interface Persona {
  tipoIdentificacion: string;
  rut: string;
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

interface Ubicacion {
  direccion: string;
  departamento: string;
  municipio: string;
  localidad: string;
  vereda: string;
  sector: string;
  upz: string;
  barrio: string;
  observacion: string;
}
