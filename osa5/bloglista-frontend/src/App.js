import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import  { useField } from './hooks/'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [loginVisible, setLoginVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const username = useField('text')
  const password = useField('text')

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log('user: ', user)
      blogService.setToken(user.token)
    }
  }, [])

  const rows = () => {
    blogs.sort((a, b) => a.likes - b.likes)
    blogs.reverse()

    return (
      blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          id={blog.id}
          user={user}
          onLike={updateBlog}
          onDelete={deleteBlog}
        />
      )
    )
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogFormRef = React.createRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log('username: ', username.value,' password: ', password.value)
      const user = await loginService.login({
        username: username.value, password: password.value
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setMessage([`${username.value} logged in`, 'note'])
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUser(user)
    } catch (exception) {
      setMessage(['wrong username or password', 'err'])
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(data => {
        setBlogs(blogs.concat(data))
      })

    setMessage([`a new blog ${blogObject.title} by ${blogObject.author} added`, 'note'])
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const deleteBlog = ( blog, id ) => {
    blogService
      .remove(id)
      .then(setBlogs(blogs.filter(blog => blog.id !== id))
      )

    setMessage([`deleted blog: ${blog.title} by ${blog.author} `, 'note'])
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = ( blog, id ) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user.id
    }

    setMessage([`liked a blog: ${blog.title} by ${blog.author} `, 'note'])
    setTimeout(() => {
      setMessage(null)
    }, 5000)

    blogService
      .update(blogObject, id)
      .then(data => { console.log(data)})
  }

  return (
    <div>
      <Notification message={message} />
      {user === null ?
        <div>
          {loginForm()}
        </div> :
        <div>
          <div> {user.name} logged in <button onClick={handleLogout}>logout</button></div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
          <h1>List of Blogs</h1>
          {rows()}
        </div>
      }
    </div>
  )
}

export default App
