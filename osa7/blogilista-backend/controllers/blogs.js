const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token
    const blogId = request.params.id
    const blog = await Blog.findById(blogId)
    const user = await User.findById(blog.user)

    if (blog === null) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if ( blog.user.toString() === decodedToken.id.toString() ) {
      const index = user.blogs.indexOf(blogId)
      if (index > -1) {
        user.blogs.splice(index, 1)
      }

      await Blog.findByIdAndRemove(blogId)
      await User.findByIdAndUpdate(blog.user, user, { new: true })
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'Unauthorized user' })
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try{
    const body = request.body
    const blog = await Blog.findById(request.params.id)
    const user = await User.findById(body.user)

    if (blog === null) {
      return response.status(404).json({ error: 'blog not found' })
    } else {

      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
        comments: body.comments
      }

      await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(result => {
          response.status(200).json(result)
        })
    }

  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    if (typeof blog.likes === 'undefined' || blog.likes === null) {
      blog.likes = 0
    }

    if (typeof blog.title === 'undefined' || blog.title === null) {
      return response.status(400).end()
    }

    if (typeof blog.url === 'undefined' || blog.url === null) {
      return response.status(400).end()
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.user)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  }

  await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(result => {
      response.status(200).json(result)
    })
})

module.exports = blogsRouter
