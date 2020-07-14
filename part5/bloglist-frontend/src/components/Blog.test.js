import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
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
  let component
  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} user={testUser}/>
    )
  })
  test('Renders only title and author by default', () => {
    expect(component.getByText('Testing Blog Posts Martin Fowler')).toBeVisible()
    expect(component.getByText('Likes 7')).not.toBeVisible()
    expect(component.getByText('https://www.google.com')).not.toBeVisible()
  })

  test('Renders title and author after clicking Show', () => {
    const button = component.getByText('Show')
    fireEvent.click(button)

    expect(component.getByText('Testing Blog Posts Martin Fowler')).toBeVisible()
    expect(component.getByText('Likes 7')).toBeVisible()
    expect(component.getByText('https://www.google.com')).toBeVisible()
  })
})