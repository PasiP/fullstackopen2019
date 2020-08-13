import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

test('renders author, title and likes', () => {
  const simpleBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Nalle Puh',
    likes: 5
  }

  const component = render(
    <SimpleBlog  blog={simpleBlog}/>
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'Nalle Puh'
  )

  const div = component.container.querySelector('.likes')
  expect(div).toHaveTextContent(
    'blog has 5 likes'
  )
})

test('clicking the button two times calls event handler twice', async () => {
  const simpleBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Nalle Puh',
    likes: 5
  }

  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog  blog={simpleBlog} onClick={mockHandler} />
  )

  const element = component.container.querySelector('.likeButton')
  expect(element).toBeDefined()

  const button = component.container.querySelector('.likeButton')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})
