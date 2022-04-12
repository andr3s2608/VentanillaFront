const initialState = true;

function ViewLicenceReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_VALUE':
      return action.payload;

    case 'LICENCE_RESET':
      return action.payload;

    default:
      return state;
  }
}

export { ViewLicenceReducer };
