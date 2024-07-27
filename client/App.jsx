import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFliter] = useState('')
  const [resultMessage, setResultMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    personService.getAll().then(initialPersons =>
      setPersons(initialPersons)
    )
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const person = persons.find(item => item.name === newName)
    if (person) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...person, number: newNumber }
        personService.update(person.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
          }).catch(error => {
            console.log(error.response.data.error)
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      personService.create(newPerson)
        .then(returnedPerson => {
          setIsSuccess(true)
          setPersons(persons.concat(returnedPerson))
          setResultMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setResultMessage(null)
          }, 5000)
        }).catch(error => {
          setIsSuccess(false)
          
          setResultMessage(error.response.data.error)
          setTimeout(() => {
            setResultMessage(null)
          }, 15000)
        })
    }
  }

  const deletePerson = (id) => {
    const deletedPerson = persons.find(item => item.id === id)
    if (window.confirm(`Delete ${deletedPerson.name} ?`)) {
      personService.deletePerson(deletedPerson.id)
        .then(() =>
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        )
        .catch(error => {
          console.log(error)
          setIsSuccess(false)
          setResultMessage(`Infomation of ${person.name} has already been removed from server`)

          setTimeout(() => {
            setResultMessage(null)
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
    console.log(event.target.value)
    setNewFliter(event.target.value)
  }

  const personsToShow = newFilter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={resultMessage} isSuccess={isSuccess} />
      <Fliter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} name={newName} nameOnChange={handleNameChange} number={newNumber} numberOnChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

const Fliter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with<input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, name, nameOnChange, number, numberOnChange }) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={name} onChange={nameOnChange} />
        </div>
        <div>
          number: <input value={number} onChange={numberOnChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(person =>
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </li>
      )}
    </ul>
  )
}

const Notification = ({ isSuccess, message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={isSuccess ? 'success' : 'error'}>
      {message}
    </div>
  )
}

export default App