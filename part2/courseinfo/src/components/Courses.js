import Course from './Course'

const Courses = (props) => {

  const courseList = props.courses

  return (
    <>
      {courseList.map(course => {
        return <Course key={course.id} course={course} />
      })}
    </>
  )
}

export default Courses