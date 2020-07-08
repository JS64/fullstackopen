const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const user = new User({
    username: 'root',
    name: 'Test User',
    password: 'password',
    _id: '5f050c669371e21ed3cb683a',
    blogs: ['5a422a851b54a676234d17f7', '5a422aa71b54a676234d17f8', '5a422b3a1b54a676234d17f9', '5a422b891b54a676234d17fa', '5a422ba71b54a676234d17fb', '5a422bc61b54a676234d17fc']
  })
  await user.save()
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
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd[0].blogs).toHaveLength(helper.listWithManyBlogs.length + 1)
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

describe('Fetch all users', () => {
  test('Users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('The initial user is returned as the only user', async () => {
    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(1)
  })

  test('The initial user displays the correct number of blogs', async () => {
    const res = await api.get('/api/users')
    expect(res.body[0].blogs).toHaveLength(helper.listWithManyBlogs.length)
  })
})

describe('Add users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'password' })
    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('Creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mf',
      name: 'Martin Fowler',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('Creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must contain 3 or more characters.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})