import React from 'react'

const Course = props => {
  console.log('Course ',props)
  return (
    <div>
      <Header course={props.course} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  )
}

const Header = props => {
  console.log('Header ',props)
  return (
    <h1>{props.course.name}</h1>
  )
}

const Total = props => {
  console.log(props)
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)

  return <p>total of {total} exercises</p>
}

const Part = props => {
  console.log('Part ',props)
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Content = props => {
  console.log('Content ',props)
  return(
    props.parts.map(part => <Part key={part.id} part={part} />)
  )
}

export default Course
