const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5e24f7ee047a97322858e7e7',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '5e275575d69ea833d8723786',
  },
  {
    _id:'5e24f7ee047a97322858e7e8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5e275575d69ea833d8723786',
  },
]

const initialUsers = [
  {
    blogs: ['5e24f7ee047a97322858e7e7', '5e24f7ee047a97322858e7e8'],
    username: 'Eddy',
    name: 'Edsger W. Dijkstra',
    _id: '5e275575d69ea833d8723786',
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
}
