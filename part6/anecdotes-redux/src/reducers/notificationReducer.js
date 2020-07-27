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

export const setNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    data: message
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  }
}

export default reducer