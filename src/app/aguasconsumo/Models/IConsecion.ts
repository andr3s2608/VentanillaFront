export interface IConsesion<T> {
  idSolicitud?: string;
  idPersona?: string;
  idTipodeSolicitud?: string;
  tipodeSolicitud: string;
  numeroRadicado: Number;
  fechaSolicitud: string;
  idEstado?: string;
  estado: string;
  idFuente?: string;
  idUbicacion?: string;
  idSubred?: string;

  idActividadActualSolicitud?: string;
  actividadActualSolicitud: string;

  actividadSiguienteSolicitud?: string;

  idTipodeTramite?: string;
  tipodeTramite: string;

  idUsuario?: string;
  idUsuarioAsignado?: string;

  idCitacionRevision?: string;

  idFuenteAbastecimiento?: string;
  temporal: boolean;

  persona: Persona;
  FuenteAbastecimiento: T;
}

export interface Persona {
  idPersona?: string;
  tipoIdentificacion: string;
  numeroResolucion: string;
  fechaResolucion: string;
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

export interface FuenteAbastecimiento<T> {
  idFuente?: string;
  idTipoFuente?: string;
  idSubCategoriaFuente?: string;
  idAutoridadAmbiental?: string;
  bocatoma_long_cx: string;
  bocatoma_lat_cy: string;
  nombre: string;
  descripcionFuente: string;
  descripcionOtraFuente: string;
  tienePlanta: boolean;

  acueductosFuente: T;
  sistemaTratamiento: T;
}
export interface AcueductosFuente {
  idUsuarioFuente?: string;
  idMunicipio?: string;
  idVereda: string;
  Coo_long_cx: string;
  Coo_lat_cy: string;
  idUsoFuente: string;
  descripcionOtroUso: string;
  sector: string;
  caudalTotal: string;
  idFuenteAbastecimiento?: string;
  idDepartamento?: string;
  idLocalidad?: string;
}

export interface SistemaTratamiento {
  idSistemaTratamiento?: string;
  idFuente?: string;
  sedimentador: boolean;
  mezclaRapido: boolean;
  mezclaLento: boolean;
  oxidacion: boolean;
  floculador: boolean;
  filtracion: boolean;
  desinfeccion: boolean;
  almacenamiento: boolean;
  torreAireacion: boolean;
  precloracion: boolean;
  desarenador: boolean;
  otra: boolean;
  descripcionOtro: string;
  numUsuarioUrbanos: string;
  numUsuariosRurales: string;
  poblacionUrbanos: string;
  poblacionRurales: string;
  caudalDiseño: string;
  caudalTratado: string;
}
