function SetSeguimientoDocumentos(data: any[]) {
  return {
    type: 'SET_VALUE',
    payload: data
  };
}

function ResetSeguimientoDocumentos() {
  return {
    type: 'RESET_VALUE',
    payload: []
  };
}

export { SetSeguimientoDocumentos, ResetSeguimientoDocumentos };
