function SetDireccion(data: string[]) {
  return {
    type: 'SET_VALUE',
    payload: data
  };
}

function ResetDireccion() {
  return {
    type: 'RESET_VALUE',
    payload: []
  };
}

export { SetDireccion, ResetDireccion };
