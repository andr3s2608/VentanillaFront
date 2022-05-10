const initialState: string[] = ['', '', '', '', '', '', '', '', ''];

function DireccionReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_VALUE':
      return action.payload;

    case 'RESET_VALUE':
      return state;

    default:
      return state;
  }
}

export { DireccionReducer };
