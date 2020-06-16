import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Anecdote = (props) => (
  <>
    <h1>{props.title}</h1>
    <p>{props.anecdote}</p>
    <p>has {props.votes} vote(s)</p>
  </>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(props.anecdotes.length).fill(0))
  const top = votes.indexOf(Math.max(...votes))
  const handleNext = () => {
    setSelected(Math.floor(Math.random() * props.anecdotes.length))
  }
  const handleVotes = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }
  return (
    <>
      <Anecdote title="Anecdote of the Day" anecdote={props.anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={handleVotes} text="Vote" />
      <Button onClick={handleNext} text="Next Anecdote" />
      <Anecdote title="Anecdote with Most Votes" anecdote={props.anecdotes[top]} votes={votes[top]} />
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)