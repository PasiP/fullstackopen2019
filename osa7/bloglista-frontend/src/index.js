import React from 'react'
import ReactDOM from 'react-dom'
import 'fontsource-roboto'
import { Provider } from 'react-redux'
import App from './App'
import store from './components/Store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
