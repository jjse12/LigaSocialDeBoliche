export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

export function actionCreatorHandler(state, { data }) {
    return {...state, ...data};
}

export function getActionCreatorHandlersObject(types) {
    let acho = {};
    types.forEach(type => {
        acho[type] = actionCreatorHandler
    });
    return acho;
}
