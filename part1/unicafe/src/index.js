import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)