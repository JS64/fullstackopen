import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = (props) => (
  <>
    <h1>Statistics</h1>
    <p>Good: {props.good}</p>
    <p>Neutral: {props.neutral}</p>
    <p>Bad: {props.bad}</p>
    <p>All: {props.total}</p>
    <p>Average: {(props.good - props.bad)/props.total}</p>
    <p>Positive: {100*props.good/props.total}%</p>
  </>
)

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }
  const total = good + neutral + bad
  return (
    <>
      <h1>Give Feedback</h1>
      <button onClick={handleGood} >
        Good
      </button>
      <button onClick={handleNeutral} >
        Neutral
      </button>
      <button onClick={handleBad} >
        Bad
      </button>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)