const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  res.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (req, res) => {
  if (typeof req.body.likes === 'undefined') {
    req.body.likes = 0
  }
  const assignedUser = await User.findOne({})
  req.body.user = assignedUser.id
  const blog = new Blog(req.body)
  const savedBlog = await blog.save()

  assignedUser.blogs = assignedUser.blogs.concat(savedBlog._id)
  await assignedUser.save()
  res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog.toJSON())
})

module.exports = blogRouter