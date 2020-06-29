import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
  console.log('Token set: ', token)
}

const getAll = () => {
  console.log('blogService getAll')
  const request = axios.get(baseUrl)
  request.then(response => console.log('response data ',response.data))
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedObject, id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(baseUrl.concat('/', id), updatedObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(baseUrl.concat('/', id), config)
  return response.data
}

export default { getAll, setToken, create, update, remove }
