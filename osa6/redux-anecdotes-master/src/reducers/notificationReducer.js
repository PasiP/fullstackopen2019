const initialState = '\u00A0'
let timeoutID = null

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      state = action.message
      return state
    case 'HIDE_NOTIFICATION':
      return action.message
    default:
      return state
  }
}

export const setNotification = (message, time = 5) => {
  return (dispatch) => {
    dispatch(showNotification(message, time))
    if(timeoutID != null) {
      window.clearTimeout(timeoutID)
      timeoutID = window.setTimeout(() => {
        dispatch(hideNotification('', time))
      }, 5 * 1000)
    } else {
      timeoutID = window.setTimeout(() => {
        dispatch(hideNotification('', time))
      }, time * 1000)
    }
  }
}

export const showNotification = (message, time) => {
  return {
    type: 'SET_NOTIFICATION',
    message: message,
    time: time
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION',
    message: '\u00A0',
  }
}


export default reducer
