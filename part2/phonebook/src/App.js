import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Person = ({ person, deletePerson }) => (
  <p>
    {person.name} {person.number} <Button text="Delete" onClick={() => deletePerson(person.id, person.name)} />
  </p>    
)

const Persons = ({ persons, deletePerson }) => (
    persons.map(persons => 
      <Person key={persons.name} person={persons} deletePerson={deletePerson} />
    )
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Filter = ({ filter, handleFilter }) => (
  <p>
    Filter shown with <input value={filter} onChange={handleFilter} />
  </p>
)

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }
  const notificationClass = !notification.error ? 'notification success' : 'notification error'
  return (
    <div className={notificationClass}>
      {notification.message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState({
    message: null,
    error: false
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(a => a.name).includes(newName)) {
      if (window.confirm(`${newName} is already in the phonebook.  Do you want to update their number to the new one?`)) { 
        const existingPerson = persons.find(person => person.name === newName)
        const id = existingPerson.id
        const changes = { ...existingPerson, number: newNumber}
        personService
          .update(id, changes)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated phone number for ${returnedPerson.name}`, error: false })
            setTimeout(() => {
              setNotification({ message: null, error: false })
            }, 5000)
          })
          .catch(error => {
            setNotification({ message: error.response.data.error, error: true })
            setTimeout(() => {
              setNotification({ message: null, error: false })
            }, 5000)
          })
        }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name} to phonebook`, error: false })
          setTimeout(() => {
            setNotification({ message: null, error: false })
          }, 5000)
        })
        .catch(error => {
          setNotification({ message: error.response.data.error, error: true })
          setTimeout(() => {
            setNotification({ message: null, error: false })
          }, 5000)
        })
      }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) { 
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(a => a.id !== id))
        })
        .catch(error => {
          setPersons(persons.filter(a => a.id !== id))
          setNotification({ message: `'${name}' has already been deleted from the server.`, error: true })
          setTimeout(() => {
            setNotification({ message: null, error: false })
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(persons => persons.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add a new person</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App