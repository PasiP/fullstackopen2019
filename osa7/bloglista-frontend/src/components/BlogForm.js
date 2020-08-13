import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    createBlog(blogObject)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h1>Create a new blog</h1>
      <div>
        <form onSubmit={addBlog}>
          <div>
            <TextField
              label="Title"
              variant="outlined"
              type="text"
              value={title}
              id='title'
              name="Title"
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <TextField
              label="Author"
              variant="outlined"
              type="text"
              value={author}
              id='author'
              name="Author"
              onChange={handleAuthorChange}
            />
          </div>
          <div>
            <TextField
              label="Link"
              variant="outlined"
              type="text"
              value={url}
              id='url'
              name="Url"
              onChange={handleUrlChange}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit">create</Button>
        </form>
      </div>
    </div>
  )
}


export default BlogForm
