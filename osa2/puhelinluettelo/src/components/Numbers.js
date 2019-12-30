import React from 'react'
import Person from './Person'


const Numbers = ({persons, setPersons, newFilter, message, setMessage}) => {
  console.log('Numbers ', message, setMessage)

  const personsToShow = persons.filter(person => person.name.toLowerCase().search(newFilter.toLowerCase()) !== -1)

  const rows = () =>  personsToShow.map(person => {
    return(
      <Person
        key={person.id}
        id={person.id}
        name={person.name}
        number={person.number}
        message={message}
        setMessage={setMessage}
        persons={persons}
        setPersons={setPersons}
      />
    )
  }
  )

  return (
    <ul>
      {rows()}
    </ul>
  )
}

export default Numbers
