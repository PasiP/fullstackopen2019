import React from 'react'
import { useField } from '../hooks/'
import { Card, CardContent, Button,
  TextField, Paper, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import LikeIcon from '@material-ui/icons/ThumbUp'

const Blog = ({ user, blog, id, onUpdate, onDelete, page }) => {
  const comment = useField('text')

  const handleLike = () => {
    blog.likes++
    onUpdate(blog, id, 'like')
  }

  const handleComment = () => {
    blog.comments = [...blog.comments, comment.value]
    onUpdate(blog, id, 'comment')
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      onDelete(blog, id)
    }
  }

  if(page === true) {
    return(
      <Paper
        elevation={3}
        style={{ padding: 30 }}>
        <div className="blog">
          <h1>{blog.title} - {blog.author}</h1>
          link:  <a href={blog.url}>{blog.url}</a><br />
          likes: <span className="blue">{blog.likes}</span> &#160;
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<LikeIcon />}
            onClick={() => handleLike() }
          >like</Button><br />
          added by: {blog.user.username}<br />
          { (user === null || user.username === blog.user.username) ?
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete() }>delete</Button> : ''
          }
        </div>
        <form onSubmit={handleComment}>
          <TextField
            id='comment'
            fullWidth
            label="Write a new comment"
            variant="outlined"
            {...comment} />
          <Button
            variant="contained"
            color="primary"
            type="submit">add comment</Button>
        </form>
        <h3>comments:</h3>
        <ul>
          { blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          )) }
        </ul>
      </Paper>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2"><a className="blog_link" href={'/blogs/'+ blog.id}>{blog.title} - {blog.author}</a></Typography>
            link:  <a href={blog.url}>{blog.url}</a><br />
            likes: <span className="blue">{blog.likes}</span> &#160;
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<LikeIcon />}
          onClick={() => handleLike() }
        >like</Button><br />
            added by: {blog.user.username}<br /><br />
        { (user === null || user.username === blog.user.username) ?
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete() }
          >delete</Button> : ''
        }
      </CardContent>
    </Card>
  )
}

export default Blog
