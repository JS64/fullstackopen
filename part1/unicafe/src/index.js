import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistic = ({text, value}) => (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
)

const Statistics = (props) => {
  if (props.total > 0) {
    return (
      <>
        <h1>Statistics</h1>
        <table>
          <tbody>
            <Statistic text="Good" value={props.good} />
            <Statistic text="Neutral" value={props.neutral} />
            <Statistic text="Bad" value={props.bad} />
            <Statistic text="All" value={props.total} />
            <Statistic text="Average" value={(props.good - props.bad)/props.total} />
            <Statistic text="Positive" value={100*props.good/props.total+'%'} />
          </tbody>
        </table>
      </>
    )
  }
  return (
    <>
      <h1>Statistics</h1>
      <p>No feedback given.</p>
    </>
  )
}

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
      <Button onClick={handleGood} text='Good' />
      <Button onClick={handleNeutral} text='Neutral' />
      <Button onClick={handleBad} text='Bad' />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)