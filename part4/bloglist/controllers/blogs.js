const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  blog.user = user

  if (!blog.url || !blog.title) {
    return res.status(400).send({ error: 'Title or url missing' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(400).json({ error: 'Blog does not exist' })
  }
  if ( blog.user.toString() === user._id.toString() ) {
    await blog.remove()
    user.blogs = user.blogs.filter(a => a._id.toString !== req.params.id.toString)
    await user.save()
  } else {
    return res.status(401).json({ error: 'Unauthorized: Only the blog creator may delete this blog.' })
  }
  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  req.body.user = user._id
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(400).json({ error: 'Blog does not exist' })
  }

  if ( blog.user.toString() === user._id.toString() ) {
    const blogContent = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
    const updatedBlog = await blog.update(blogContent)
    res.json(updatedBlog)
  }
})

module.exports = blogRouter