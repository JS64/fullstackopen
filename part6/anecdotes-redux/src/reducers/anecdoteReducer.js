import anecdoteService from '../services/anecdotes'

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

export const addVote = anecdote => {
  return async dispatch => {
    const newVote = await anecdoteService.addVote(anecdote)
    dispatch({
      type: 'VOTE',
      data: newVote,
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export default reducer