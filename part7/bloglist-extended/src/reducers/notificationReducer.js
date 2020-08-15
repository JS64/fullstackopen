const reducer = (state = '', action) => {
  switch(action.type) {
  case 'ALERT_SUCCESS':
    return {
      message: action.data,
      severity: 'success'
    }
  case 'ALERT_ERROR':
    return  {
      message: action.data,
      severity: 'error'
    }
  case 'HIDE_ALERT':
    return  {
      message: null,
      severity: 'success'
    }
  default:
    return state
  }
}

let timeoutID

export const notifySuccess = (message, timeout) => {
  return async dispatch => {
    clearTimeout(timeoutID)
    dispatch({
      type: 'ALERT_SUCCESS',
      data: message
    })
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'HIDE_ALERT'
      })
    }, timeout * 1000)
  }
}

export const notifyError = (message, timeout) => {
  return async dispatch => {
    clearTimeout(timeoutID)
    dispatch({
      type: 'ALERT_ERROR',
      data: message
    })
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'HIDE_ALERT'
      })
    }, timeout * 1000)
  }
}

export default reducer