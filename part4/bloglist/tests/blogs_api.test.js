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

describe('Deleting a single blog post', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length - 1)
    const id = blogsAtEnd.map(r => r.id)
    expect(id).not.toContain(blogToDelete.id)
  })
})

describe('Update a blog post', () => {
  test('Succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]
    const updatedBlog = {
      title: 'Introduction to Testing II',
      author: 'Martin Fowler Jr',
      url: 'https://www.google.com',
      likes: 2
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length)
    expect(blogsAtEnd[blogsAtEnd.length - 1].title).toBe('Introduction to Testing II')
  })
})

afterAll(() => {
  mongoose.connection.close()
})