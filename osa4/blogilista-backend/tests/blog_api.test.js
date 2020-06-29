const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')



beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  let userObject = new User(helper.initialUsers[0])
  await userObject.save()
})

describe('4.8 tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('the first blog is about "Canonical string reduction', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'Canonical string reduction'
    )
  })
})

describe('4.9 test', () => {
  test('blogs are identified by a field called "id".', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('4.10 test', () => {
  const newBlog = {
    title: 'Test Blog for testing purposes',
    author: 'Tony Testman',
    url: 'https://blogger.com/testblog',
    likes: 1,
    user: '5e275575d69ea833d8723786',
  }

  test('adding a new blog', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    expect(response.body.length).toBe(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'Test Blog for testing purposes'
    )
  })
})

describe('4.11 test', () => {
  test('when adding a new blog likes is set to zero if not defined', async () => {
    const newBlog = {
      title: 'Another Test Blog for testing purposes',
      author: 'Tessa Testwoman',
      url: 'https://blogger.com/anothertestblog',
      user: '5e275575d69ea833d8723786',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.likes)
    expect(contents).toContain(0)
  })
})

describe('4.12 test', () => {
  test('adding a titleless new blog', async () => {
    const titlelessBlog = {
      author: 'Tony Testman',
      url: 'https://blogger.com/testblog',
      likes: 5,
      user: '5e275575d69ea833d8723786',
    }

    await api
      .post('/api/blogs')
      .send(titlelessBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })

  test('adding a urless new blog', async () => {
    const urlessBlog = {
      title: 'Test Blog for testing purposes',
      author: 'Tony Testman',
      likes: 1,
      user: '5e275575d69ea833d8723786',
    }

    await api
      .post('/api/blogs')
      .send(urlessBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

describe('4.13 test', () => {
  test('removing a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(
      helper.initialBlogs.length - 1
    )
  })
})

describe('4.14 test', () => {
  test('modifying number of likes', async () => {
    const likesToUpdate = 15
    const blogToUpdate = {
      id: '5e24f7ee047a97322858e7e7',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: likesToUpdate,
      user: '5e275575d69ea833d8723786',
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(likesToUpdate)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'adm',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is too short or missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

test('creation fails with proper statuscode and message if password is missing', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'nimi',
    name: 'Teppo Tulppo',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password is too short or missing')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})
