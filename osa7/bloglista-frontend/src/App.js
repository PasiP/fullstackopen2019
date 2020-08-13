import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PersonIcon from '@material-ui/icons/AccountBox'
import BlogObject from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'
import { useField } from './hooks/'
import { setNotification } from './reducers/notificationReducer'
import { setUser } from './reducers/userReducer'
import {
  initializeBlogs, createBlog,
  removeBlog, addVote, addComment } from './reducers/blogReducer'
import {
  BrowserRouter as Router,
  Switch, Route, useParams, Link
} from 'react-router-dom'
import { Container, Paper, Button,
  AppBar, Toolbar, Typography, Box,
  TableContainer, TableBody, TableCell,
  TableHead, TableRow, Table } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/FavoriteTwoTone'
import './App.css'


const App = () => {
  const dispatch = useDispatch()
  const [loginVisible, setLoginVisible] = useState(false)
  const [users, setUsers] = useState([])
  const username = useField('text')
  const password = useField('text')
  const message = useSelector(state => state.notifications)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => { // IIFE(Immediately Invoked Function Expression)
    (async () => {
      setUsers( await usersService.getAll() )
    })()
  },[])

  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      blogService.setToken(loggedUser.token)
    }
  }, [dispatch])

  const rows = () => {
    const page = false
    blogs.sort((a, b) => a.likes - b.likes)
    blogs.reverse()

    return (
      blogs.map(blog =>
        <BlogObject
          key={blog.id}
          blog={blog}
          id={blog.id}
          user={user}
          onUpdate={updateBlog}
          onDelete={deleteBlog}
          page={page}
        />
      )
    )
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <h1><FavoriteIcon color="secondary" style={{ fontSize: 30 }} />AWESOME BLOGLIST TOOL</h1>
        <div style={hideWhenVisible}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setLoginVisible(true)}>log in</Button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleSubmit={handleLogin}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setLoginVisible(false)}>cancel</Button>
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
      dispatch(setNotification([`${username.value} logged in`, 'note'], 10))
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification(['wrong username or password', 'err'], 10))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const createNewBlog = (blogObject) => {
    dispatch(createBlog(blogObject))
    dispatch(setNotification([`a new blog ${blogObject.title} by ${blogObject.author} added`, 'note'], 10))
  }

  const deleteBlog = ( blog, id ) => {
    dispatch(removeBlog(id))
    dispatch(setNotification([`deleted blog: ${blog.title} by ${blog.author} `, 'note'], 10))
  }

  const updateBlog = ( blog, id, type ) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      comments: blog.comments,
      user: blog.user.id
    }
    if(type === 'like') {
      dispatch(addVote(blogObject, id))
      dispatch(setNotification([`liked a blog: ${blog.title} by ${blog.author} `, 'note'], 10))
    } else if(type === 'comment'){
      dispatch(addComment(blogObject, id))
      dispatch(setNotification([`Commented a blog: ${blog.title} by ${blog.author} `, 'note'], 10))
    }
  }

  const Users = () => (
    <div>
      <h1>Users</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell>Name:</TableCell>
            <TableCell>Blogs created:</TableCell>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <a className="user_link" href={`/users/${user.id}`}>{user.name}</a>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  const Home = () => (
    <div className="home">
      { user === null ?
        '' :
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef} >
            <BlogForm createBlog={createNewBlog} />
          </Togglable>
          <h1>List of Blogs</h1>
          { rows() }
        </div>
      }
    </div>
  )

  const User = ({ users }) => {
    const id = useParams().id
    const user = users.find(n => n.id === String(id))

    if (!user) {
      return null
    }

    return (
      <div>
        <h1><PersonIcon style={{ fontSize: 40 }} /> {user.name}</h1>
        <h3>Added blogs:</h3>
        <ul>
          { user.blogs.map((blog, index) => (
            <li key={index}>{ blog.title }</li>
          )) }
        </ul>
      </div>
    )
  }

  const Blog = ({ blogs }) => {
    const id = useParams().id
    const blog = blogs.find(n => n.id === String(id))
    const page = true

    if (!blog) {
      return null
    }

    return(
      <div>
        <BlogObject
          key={blog.id}
          blog={blog}
          id={blog.id}
          user={user}
          onUpdate={updateBlog}
          onDelete={deleteBlog}
          page={page}
        />
      </div>
    )
  }

  return (
    <Container>
      <Paper
        elevation={3}
        style={{ padding: 30 }}>
        <Router>
          <div>
            <Notification message={message} />
            {user === null ?
              <div>
                {loginForm()}
              </div> :
              <AppBar position="static">
                <Toolbar>
                  <Box display='flex' flexGrow={1}>
                    <Button
                      edge="start"
                      size="large"
                      color="inherit"
                      component={Link}
                      to="/">Blogs
                    </Button>
                    <Button
                      edge="start"
                      size="large"
                      color="inherit"
                      component={Link}
                      to="/users">Users
                    </Button>
                  </Box>
                  <Typography style={{ margin: 20 }} type="title" color="inherit">
                    {user.name} logged in
                  </Typography>
                  <Button
                    className="logout"
                    variant="contained"
                    onClick={handleLogout}>logout
                  </Button>
                </Toolbar>
              </AppBar>
            }
          </div>
          <Switch>
            <Route path="/users/:id">
              <User users={users} />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/blogs/:id">
              <Blog blogs={blogs} />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Paper>
    </Container>
  )
}

export default App
