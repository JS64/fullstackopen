import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('Renders only title and author by default', () => {
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

  const component = render(
    <Blog blog={testBlog} user={testUser}/>
  )

  expect(component.getByText('Testing Blog Posts Martin Fowler')).toBeVisible()
  expect(component.getByText('Likes 7')).not.toBeVisible()
  expect(component.getByText('https://www.google.com')).not.toBeVisible()

})