import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const testUser = {
  username: 'test',
  name: 'Test User'
}

const testBlog = {
  author: 'Martin Fowler',
  title: 'Testing Blog Posts',
  likes: 7,
  url: 'https://www.google.com',
  user: testUser
}

describe('<Blog />', () => {
  test('Renders only title and author by default', () => {
    const component = render(
      <Blog blog={testBlog} user={testUser}/>
    )
    expect(component.getByText('Testing Blog Posts Martin Fowler')).toBeVisible()
    expect(component.getByText('Likes 7')).not.toBeVisible()
    expect(component.getByText('https://www.google.com')).not.toBeVisible()
  })

  test('Renders title and author after clicking Show', () => {
    const component = render(
      <Blog blog={testBlog} user={testUser}/>
    )
    const showButton = component.getByText('Show', { selector: 'button' })
    fireEvent.click(showButton)

    expect(component.getByText('Testing Blog Posts Martin Fowler')).toBeVisible()
    expect(component.getByText('Likes 7')).toBeVisible()
    expect(component.getByText('https://www.google.com')).toBeVisible()
  })

  test('Clicking Like twice calls event handler twice', () => {
    const handleLikes = jest.fn()
    const component = render(
      <Blog blog={testBlog} user={testUser} handleLikes={handleLikes}/>
    )
    const likeButton = component.getByText('Like', { selector: 'button' })
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handleLikes.mock.calls).toHaveLength(2)
  })
})