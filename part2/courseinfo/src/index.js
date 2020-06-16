import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({ course }) => (
  <h2>{course.name}</h2>
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
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      <h1>Web Development Curriculum</h1>
      {courses.map(courses => 
        <Course key={courses.id} course={courses} />
      )}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))