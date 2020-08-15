import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Renders only title and author by default', () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Testing Blog Posts' }
    })
    fireEvent.change(author, {
      target: { value: 'Martin Fowler' }
    })
    fireEvent.change(url, {
      target: { value: 'https://www.google.com' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls[0][0].title).toBe('Testing Blog Posts' )
    expect(createBlog.mock.calls[0][0].author).toBe('Martin Fowler' )
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.google.com' )
  })
})