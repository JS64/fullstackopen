const reducer = (state = '', action) => {
  switch(action.type) {
  case 'SET_FILTER':
    return action.data
  default:
    return state
  }
}

export const setFilter = (query) => {
  return {
    type: 'SET_FILTER',
    data: query
  }
}

export default reducer