const Notification = ({ message, notificationStyle }) => {

  const notificationStyleSuccess = {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 20,
  }

  const notificationStyleError = {
    color: 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 20,
  }

  return (
    <div style={notificationStyle ? notificationStyleSuccess : notificationStyleError}>
      {message}
    </div>
  )
}

export default Notification