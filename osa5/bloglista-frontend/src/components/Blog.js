import React, { useState } from 'react'

const Blog = ({ user, blog, id, onLike, onDelete }) => {
  const [infoVisible, setInfoVisible] = useState(true)

  const handleLike = () => {
    blog.likes++
    onLike(blog, id)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      onDelete(blog, id)
    }
  }

  return (
    <div>
      { infoVisible ?
        <div className="blogtitle" onClick={() => setInfoVisible(!infoVisible)}>{blog.title} {blog.author} <button className="viewbutton" onClick={() => setInfoVisible(!infoVisible)}>view</button></div> :
        <div>
          <div className="blogtitle" onClick={() => setInfoVisible(!infoVisible)}>{blog.title} {blog.author} <button className="viewbutton" onClick={() => setInfoVisible(!infoVisible)}>hide</button></div>
              url:  <a href={blog.url}>{blog.url}</a><br />
              likes: {blog.likes} <button onClick={() => handleLike() }>like</button><br />
              added by: {blog.user.username}<br />
          { (user === null || user.username === blog.user.username) ?
            <button onClick={() => handleDelete() }>delete</button> : ''
          }
        </div>
      }
    </div>
  )
}

export default Blog
