import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import personService from './services/persons'
import Filter from './components/Filter'
import Numbers from './components/Numbers'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [message, setMessage] = useState([])



  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const Notification = () => {
    if (message.length <= 0) {
      return null
    }

    if(message[1] === 'err') {
      return (
        <div className="error">
          {message[0]}
        </div>
      )
    } else {
      return (
        <div className="notification">
          {message[0]}
        </div>
      )
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
      id:'',
    }

    if(persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?` )) {
        const idx = persons.findIndex(person => person.name === newName)
        const id = persons[idx].id
        personObject.id=id
        const newPersons = persons.map(p=> p.name === newName? personObject : p)

        personService
        .update(id, personObject)
        .then(response => {
            setPersons(newPersons)
            setMessage([`${newName} updated`, 'note'])
            setTimeout(() => {
              setMessage([])
            }, 5000)
            setNewName('')
            setNewNumber('')
            console.log('RESPONSE:', response.data);
          })
      } else {
        console.log("user clicked cancel");
      }
    } else {
      personService
      .create(personObject)
      .then(response => {
          setPersons(persons.concat(response.data))
          console.log('PERSONSERVICE CREATE')
          setMessage([`${newName} created`, 'note'])
          setTimeout(() => {
            setMessage([])
          }, 5000)
          setNewName('')
          setNewNumber('')
      })
      .catch( error => {
        console.log('ERR ', error.response.data);
        setMessage([error.response.data.error, 'err'])
        setTimeout(() => {
          setMessage([])
        }, 5000)
      })
    }
  }


  const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
      }

    const handleFilterChange = (event) => {
      console.log('filter: ',event.target.value)
      setNewFilter(event.target.value)
    }

  return (
    <div>
      <Notification />
      <h2>Phonebook</h2>
      <Filter filterValue={newFilter} handleFilterChange={handleFilterChange} />
      <form onSubmit={addPerson}>
        <div>
          name: <input
                  value={newName}
                  onChange={handleNameChange}
                />
        </div>
        <div>
          number: <input
                  value={newNumber}
                  onChange={handleNumberChange}
                />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers persons={persons} setPersons={setPersons} message={message} setMessage={setMessage} newFilter ={newFilter} />
    </div>
  )

}

export default App

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
