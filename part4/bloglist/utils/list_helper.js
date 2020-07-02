const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const index = likes.indexOf(Math.max(...likes))
  return blogs.length === 0
    ? blogs
    : _.pick(blogs[index], ['title', 'author', 'likes'])
}

const mostBlogs = (blogs) => {
  const top = _.chain(blogs)
    .countBy('author')
    .map((value, key) => ({ author: key, blogs: value }))
    .maxBy('blogs')
    .value()
  return blogs.length === 0
    ? blogs
    : top
}

const mostLikes = (blogs) => {
  const top = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({
      author: key,
      likes: value.map(value => value.likes).reduce((sum, item) => sum + item)
    }))
    .maxBy('likes')
    .value()
  return blogs.length === 0
    ? blogs
    : top
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}