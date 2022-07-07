export interface IRegistroSolicitudPrimeraVez<T> {
  solicitud: Solicitud<T>;
}

export interface Solicitud<T> {
  idTipoSolicitud?: string;
  numeroRadicado: number;
  idTipoTramite?: string;
  idPersona?: string;
  idUsuario?: string;
  idUbicacion?: string;

  temporal: boolean;

  persona: Persona;
  ubicacion: UbicacionPersona;
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
  idUbicacion?: string;
  direccion: string;
  departamento?: string;
  municipio?: string;
  localidad?: string;
  vereda: string;
  sector: string;
  upz?: string;
  barrio?: string;
  observacion: string;
}
