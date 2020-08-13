import React from 'react'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'


describe('<App />', () => {
  test('if no user logged, blogs are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('log in')
    )

    const element = component.getByText(
      'log in'
    )
    expect(element).toBeDefined()

    expect(component.container).not.toHaveTextContent(
      'List of Blogs'
    )

    expect(component.container).not.toHaveTextContent(
      'Go To Statement Considered Harmful'
    )
  })

  test('if user logged in, blogs are rendered correctly', async () => {
    const user = {
      username: 'admin',
      token: '123413241324',
      name: 'admin'
    }

    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('cancel')
    )

    // component.debug()

    expect(component.container).toHaveTextContent(
      'List of Blogs'
    )

    expect(component.container).toHaveTextContent(
      'Go To Statement Considered Harmful'
    )

    expect(component.container).toHaveTextContent(
      'Canonical string reduction'
    )

    expect(component.container).toHaveTextContent(
      'Angular vs React vs Vue: Which Framework to Choose in 2020'
    )
  })
})
