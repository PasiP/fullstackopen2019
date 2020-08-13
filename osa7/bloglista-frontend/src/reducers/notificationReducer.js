const initialState = ['\u00A0', 'hidden']
let timeoutID = null

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SHOW':
    state = action.message
    return state
  case 'HIDE':
    state = action.message
    return state
  case 'ERR':
    state = action.message
    return state
  default:
    return state
  }
}

export const setNotification = (message, time = 5) => {
  return (dispatch) => {
    dispatch(showNotification(message, time))
    if(timeoutID !== null) {
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
    type: 'SHOW',
    message: message,
    time: time
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE',
    message: ['\u00A0','hidden']
  }
}

export default notificationReducer
