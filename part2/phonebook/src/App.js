import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import { nanoid } from 'nanoid'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFilter, setShowFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationSuccess, setNotificationSuccess] = useState(true)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
      setFilteredPersons(initialPersons)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setShowFilter(event.target.value.toLowerCase())

    let filtered = []
    
    // If the filter is empty, then set the filteredPersons array to be the same 
    // as the persons array
    if (event.target.value.localeCompare('') === 0) {
      filtered = persons
      setFilteredPersons(persons)
    } else {
      // Else, we filter the persons array using the filter provided
      filtered = persons.filter(person => {
        return person.name.toLowerCase().startsWith(event.target.value.toLowerCase())
      })
      console.log('Filtered array after filter', filtered)
    }

    setFilteredPersons(filtered)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {
      name: newName,
      number: newNumber,
      id: nanoid()
    }

    let alreadyAPerson = false;

    persons.forEach(person => {
      if (person.name.localeCompare(newPerson.name) === 0) {
        alreadyAPerson = true;
        if (window.confirm(`${newPerson.name} is already added to the phonebook, replace
        the old number with a new one?`)) {
          update(person.id)
        } else {
          alreadyAPerson = true
        }
      }
    })

    if (alreadyAPerson) {
      return
    }

    personService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
      setFilteredPersons(filteredPersons.concat(newPerson))
      setNotificationSuccess(true)
      setNotificationMessage(`Added ${newPerson.name}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    })
  }

  const deletePerson = (id) => {
    personService.cutPerson(id)
    .then(response => {
      setNotificationMessage('Successful deletion')
      setNotificationSuccess(true)
    })
    .catch(error => {
      const found = filteredPersons.find(person => {
        return person.id === id
      })
      setNotificationMessage(`Information of ${found.name} has already been removed from the server`)
      setNotificationSuccess(false)
    })

    setPersons(persons.filter(p => p.id !== id))
    setFilteredPersons(persons.filter(p => p.id !== id))
  }

  const update = (id) => {
    const personToUpdate = persons.find(person => {
      return person.id === id
    })

    const updatedPerson = {
      ...personToUpdate,
      number: newNumber,
    }

    personService.updatePerson(id, updatedPerson)
    setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
    setFilteredPersons(persons.map(person => person.id !== id ? person : updatedPerson))
    setNewName('')
    setNewNumber('')
    setNotificationMessage(`Updated ${updatedPerson.name}`)
    setNotificationSuccess(true)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage} notificationStyle={notificationSuccess}/>
        <Filter handleFilter={handleFilter}/>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handlePhoneChange={handlePhoneChange}/>
      <h2>Numbers</h2>
        <Persons filteredPersons={filteredPersons} showFilter={showFilter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App