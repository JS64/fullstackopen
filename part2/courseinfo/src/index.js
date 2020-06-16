import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({ course }) => (
  <h1>{course.name}</h1>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>    
)

const Content = ({ parts }) => (
  <>
    {parts.map(parts => 
      <Part key={parts.id} part={parts} />
    )}
  </>
)

const Total = ({ parts }) => {
  const total = parts.map(a => a.exercises).reduce((a,b) => a + b)
  return (
    <b>
      Total of {total} exercise(s)
    </b>
  )
}

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

ReactDOM.render(<App />, document.getElementById('root'))