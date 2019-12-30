import React from 'react'
import personService from '../services/persons'


const Person = (props) => {
  console.log('Person ', props);
  const handleClick = () => {
    console.log('button ', props.id ,' clicked')
    personService
      .deleteItem(props.id)
      .then(response => {
          props.setMessage([`${props.name} was removed`, 'note'])
          setTimeout(() => {
            props.setMessage([])
          }, 5000)
          props.setPersons(props.persons.filter(n => n.id !== props.id))
      })
      .catch(error => {
        console.log('delete failed')
        props.setMessage([`${props.name} has alredy been removed from server`, 'err'])
        setTimeout(() => {
          props.setMessage([])
        }, 5000)
      })
  }

  return (
    <li><button onClick={handleClick}>delete</button> {props.name} {props.number}</li>
  )
}

export default Person
