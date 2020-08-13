const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return (prev.likes > current.likes)
      ? prev
      : current
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const authorArray = _.map(blogs, 'author')
  const mostCommon = _.chain(authorArray)
    .groupBy()
    .map(d => ( { author: d[0], blogs: d.length } ))
    .last()
    .value()

  return mostCommon
}

const mostLikes = (blogs) => {
  const result = _.chain(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      'author': key,
      'likes': _.sumBy(objs, 'likes') }))
    .reduce((prev, current) => {
      return (prev.likes > current.likes)
        ? prev
        :current
    })
    .value()

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
