import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  console.log('usersService getAll')
  const request = axios.get(baseUrl)
  request.then(response => console.log('response data ',response.data))
  return request.then(response => response.data)
}

export default { getAll }
