import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Togglable />', () => {
  let component

  const blog = {
    title: 'Angular vs React vs Vue: Which Framework to Choose in 2020',
    author: 'Shaumik Daityari',
    url: 'https://www.codeinwp.com/blog/angular-vs-vue-vs-react',
    likes: 2,
    user: {
      username: 'admin',
      name: 'admin',
      id: '5e45cbdca8514925c8aa5c8d'
    },
    id: '5e56fb8abd590f1050a2c14d'
  }

  const user = {
    blogs: [
      {
        title: 'Angular vs React vs Vue: Which Framework to Choose in 2020',
        url: 'https://www.codeinwp.com/blog/angular-vs-vue-vs-react',
        likes: 2,
        id: '5e56fb8abd590f1050a2c14d'
      }
    ],
    username: 'admin',
    name: 'admin',
    id: '5e45cbdca8514925c8aa5c8d'
  }

  const id = '5e56fb8abd590f1050a2c14d'
  const onDelete = null
  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog
        key={id}
        blog={blog}
        id={blog.id}
        user={user}
        onLike={mockHandler}
        onDelete={onDelete}
      />
    )
  })

  test('5.13 & 5.14 clicking title shows blog info', () => {

    expect(component.container).toHaveTextContent(
      'Angular vs React vs Vue: Which Framework to Choose in 2020'
    )

    expect(component.container).toHaveTextContent(
      'Shaumik Daityari'
    )

    expect(component.container).not.toHaveTextContent(
      'https://www.codeinwp.com/blog/angular-vs-vue-vs-react'
    )

    const element = component.container.querySelector('.blogtitle')
    fireEvent.click(element)

    expect(component.container).toHaveTextContent(
      'https://www.codeinwp.com/blog/angular-vs-vue-vs-react'
    )

    expect(component.container).toHaveTextContent(
      'likes: 2'
    )

  })

  test('5.15 clicking like button twice', () => {
    const element = component.container.querySelector('.blogtitle')
    fireEvent.click(element)

    expect(component.container).toHaveTextContent(
      'likes: 2'
    )

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls.length).toBe(2)
  })
})
