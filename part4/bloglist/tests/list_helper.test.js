const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list is nothing', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual([])
  })

  test('when list has only one blog equals that blog', () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog)
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('of a bigger list is the blog with most votes', () => {
    const result = listHelper.favoriteBlog(helper.listWithManyBlogs)
    expect(result).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    )
  })
})

describe('most blogs', () => {
  test('of empty list is nothing', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual([])
  })

  test('when list has only one blog equals the author of that blog', () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })

  test('of a bigger list is the author with the most blogs', () => {
    const result = listHelper.mostBlogs(helper.listWithManyBlogs)
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})

describe('most likes', () => {
  test('of empty list is nothing', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual([])
  })

  test('when list has only one blog equals the author of that blog', () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('of a bigger list is the author with the most blogs', () => {
    const result = listHelper.mostLikes(helper.listWithManyBlogs)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})