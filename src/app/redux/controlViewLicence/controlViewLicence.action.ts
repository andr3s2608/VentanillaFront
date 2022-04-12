function SetViewLicence(data: boolean) {
  return {
    type: 'SET_VALUE',
    payload: data
  };
}

function SetResetViewLicence() {
  return {
    type: 'LICENCE_RESET',
    payload: true
  };
}

export { SetViewLicence, SetResetViewLicence };
