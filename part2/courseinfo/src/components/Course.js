import React from 'react';

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

export default Course