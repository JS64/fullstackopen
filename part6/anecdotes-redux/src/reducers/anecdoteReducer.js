const reducer = (state = [], action) => {
  switch(action.type) {
  case 'VOTE': {
    const id = action.data.id
    const anecdoteToUpdate = state.find(n => n.id === id)
    const changedAnecdote = {
      ...anecdoteToUpdate,
      votes: anecdoteToUpdate.votes + 1
    }
    return state.map(anecdote =>
      anecdote.id !== id ? anecdote : changedAnecdote
    )
  }
  case 'NEW_ANECDOTE':
    return [...state, action.data]
  case 'INIT_ANECDOTES':
    return action.data
  default:
    return state
  }
}

export const addVote = (id) => {
  return {
    type: 'VOTE',
    data: { id },
  }
}

export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data,
  }
}

export const initializeAnecdotes = (data) => {
  return {
    type: 'INIT_ANECDOTES',
    data,
  }
}

export default reducer