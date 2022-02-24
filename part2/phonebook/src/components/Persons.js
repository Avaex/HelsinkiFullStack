const Persons = ({ filteredPersons, showFilter, deletePerson }) => {
  return (
    <>
      {filteredPersons.map(person => (
        <div key={person.name}>
          <p>
            {person.name} {person.number}
          </p>
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
      )
      )}
    </>
  )
}

export default Persons