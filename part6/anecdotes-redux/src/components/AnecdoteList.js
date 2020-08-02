import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification, hideNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
    return filteredAnecdotes.sort((a,b) => b.votes - a.votes)
  })
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`You voted for '${anecdote.content}'.`))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
                has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList