import blogService from '../services/blogs'


const blogReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data
  case 'ADD_VOTE':
    return state
  case 'ADD_COMMENT':
    return state
  case 'DELETE_BLOG':
    return state.filter(n => n.id !== action.data.id)
  default:
    return state
  }
}

export const addVote = (blogObject, id) => {
  return async dispatch => {
    const response = await blogService.update(blogObject, id)
    dispatch({
      type: 'ADD_VOTE',
      data: { response }
    })
  }
}

export const addComment = (blogObject, id) => {
  console.log('%c ADD COMMENT','color: red; font-weight: bold;')
  return async dispatch => {
    const response = await blogService.addComment(blogObject, id)
    dispatch({
      type: 'ADD_COMMENT',
      data: { response }
    })
  }
}

export const initializeBlogs = () => {
  console.log('%c INITIALIZE !!!','color: red; font-weight: bold;')
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (content) => {
  console.log('%c CREATE BLOG','color: red; font-weight: bold;')
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const removeBlog = (id) => {
  console.log('%c DELETE BLOG: ','color: red; font-weight: bold;', id)
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: { id }
    })
  }
}

export default blogReducer
