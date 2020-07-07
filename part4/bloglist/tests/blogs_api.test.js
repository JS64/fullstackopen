const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithManyBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Fetch all blog posts', () => {
  test('Blog posts are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blog posts are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('Blog posts use \'id\' as unique identifier', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
  })
})

describe('Add a new blog post', () => {
  test('Succeeds with valid data', async () => {
    const newBlog = {
      title: 'Introduction to Testing',
      author: 'Martin Fowler',
      url: 'https://www.google.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].title).toBe('Introduction to Testing')
  })

  test('Likes default to 0 if not provided', async () => {
    const newBlog = {
      title: 'Introduction to Testing',
      author: 'Martin Fowler',
      url: 'https://www.google.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('Returns 400 Bad Request if no title or url provided', async () => {
    const newBlog = {
      author: 'Martin Fowler',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})