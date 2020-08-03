const reducer = (state = '', action) => {
  switch(action.type) {
  case 'SET_NOTIFICATION':
    return action.data
  case 'HIDE_NOTIFICATION':
    return null
  default:
    return state
  }
}

var timeoutID

export const setNotification = (notification, timeout) => {
  return async dispatch => {
    clearTimeout(timeoutID)
    dispatch({
      type: 'SET_NOTIFICATION',
      data: notification
    })
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
    }, timeout * 1000)
  }
}

export default reducer