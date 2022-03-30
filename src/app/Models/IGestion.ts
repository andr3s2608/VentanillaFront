export interface IGestionTramite<T> {
  estado: T;
}
export interface EstadoDocumentos {
  idSolicitud: string;
  idDocumentoSoporte: string;
  Path: string;
  Estado_Documento: string;
  TipoSeguimiento: string;
  Observaciones: string;
}
