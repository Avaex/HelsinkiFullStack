const Course = (course) => {

  const { id, name, parts } = course.course

  const initialValue = 0
  const exerciseSum = parts.reduce((previousValue, currentValue) => previousValue + currentValue.exercises, initialValue)

  return (
    <>
      <h1>{name}</h1>
      {parts.map((part) => (
        <p key={part.id}>{part.name} {part.exercises}</p>
      )
      )}
      <p>Total of {exerciseSum} exercises</p>
    </>
  )
}

export default Course