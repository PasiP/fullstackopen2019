import React, { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import Login from './components/Login'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState('authors')
  const result = useQuery(ALL_BOOKS)
  const client = useApolloClient()
  const [allBooks, setAllBooks] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if ( token ) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if(result.loading === false && result.data){
        setAllBooks(result.data.allBooks)
      }
  }, [result.loading, result.data])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      setMessage(`Added a book titled ${subscriptionData.data.bookAdded.title} by ${subscriptionData.data.bookAdded.author.name}`)
      setTimeout(() => { setMessage('') }, 5 * 1000 )
    }
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors
          show={page === 'authors'}
        />

        <Books
          show={page === 'books'}
          allBooks={ allBooks }
        />

        <Login
          show={page === 'login'}
          setToken={ setToken }
        />
      </div>
    )
  }

  const msgStyle = { color: 'red'}

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={ logout } >logout</button>
      </div>


      <div style={msgStyle}>{message}</div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
        allBooks= { allBooks }
      />

      <NewBook
        show={page === 'add'}
        setAllBooks={ setAllBooks }
      />

      <Recommendations
        show={page === 'recommend'}
        allBooks={ allBooks }
      />
    </div>
  )
}

export default App
