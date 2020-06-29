import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('5.16 New Blog creatition test', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  // component.debug()

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'this is a test title' }
  })

  fireEvent.change(author, {
    target: { value: 'test author' }
  })

  fireEvent.change(url, {
    target: { value: 'test.url.com' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith({ 'title': 'this is a test title', 'author': 'test author', 'url': 'test.url.com' })
})
