import axios from 'axios'

const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseURL, newObject)
  return request.then(response => response.data)
}

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseURL}/${id}`, newObject)
  return request.then(response => response.data)
}

const cutPerson = (id) => {
  const request = axios.delete(`${baseURL}/${id}`).catch(error => {
    console.log('Error deleting person:', id)
  })
  return request.then(response => response.data)
}

export default { getAll, create, updatePerson, cutPerson }