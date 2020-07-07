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

afterAll(() => {
  mongoose.connection.close()
})