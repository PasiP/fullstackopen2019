import React, { useState } from 'react'

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
      <h1>Create new</h1>
      <div>
        <form onSubmit={addBlog}>
          <div>
          title
            <input
              type="text"
              value={title}
              id='title'
              name="Title"
              onChange={handleTitleChange}
            />
          </div>
          <div>
          author
            <input
              type="text"
              value={author}
              id='author'
              name="Author"
              onChange={handleAuthorChange}
            />
          </div>
          <div>
          url
            <input
              type="text"
              value={url}
              id='url'
              name="Url"
              onChange={handleUrlChange}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </div>
  )
}


export default BlogForm
