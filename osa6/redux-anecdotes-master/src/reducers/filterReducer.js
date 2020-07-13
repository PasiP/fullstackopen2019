const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTERTEXT':
      state = action.message
      return state
    default:
      return state
  }
}

export const setFilterText = (message) => {
  return {
    type: 'SET_FILTERTEXT',
    message: message
  }
}

export default reducer
