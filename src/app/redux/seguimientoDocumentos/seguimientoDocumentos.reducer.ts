const initialState: any[] = [];

function SeguimientoDocumentosReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_VALUE':
      return action.payload;

    case 'RESET_VALUE':
      return state;

    default:
      return state;
  }
}

export { SeguimientoDocumentosReducer };
