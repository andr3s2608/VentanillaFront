export interface IObservaciones<T> {
  idSolicitud?: string;
  idTipoSolicitud?: string;
  observaciones: T;
  citacion: Citacion_Revision;
}

export interface Citacion_Revision {
  idCitacion?: string;
  fechaCitacion: string;
  observacion: string;
  fechaRegistro: string;
  idSolicitud: string;
  idUsuario: string;
}
