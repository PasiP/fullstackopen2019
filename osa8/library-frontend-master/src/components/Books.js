import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'


const Books = ({ show, allBooks }) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
     if(!result.data) {
       setBooks(allBooks)
     } else{
       if(!result.loading && result.called) {
         setBooks(result.data.allBooks)
       }
     }
       }, [allBooks, result])

  if (!show) {
    return null
  }

  const flatten = allBooks.reduce(
    ( acc, curr ) => acc.concat(curr.genres),
    []
  )

  const genres = [...new Set(flatten)]

  const showBooks = (genre) => {
    getBooks({ variables: { genreToSearch: genre} })
  }

  const setGenreMsg = (genre) => {
    if(typeof genre  === 'string') {
      setMessage(<p>in genre <b>{genre}</b></p>)
    } else {
      setMessage('')
    }
  }

  return (
    <div>
      <h2>books</h2>
      {message}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(b =>
        <button key={b} onClick={() => {
          setGenreMsg(b)
          showBooks(b)
        }} >{b}</button>
      )}
      <button onClick={() => {
        setBooks(allBooks)
        setGenreMsg(0)
      }} >all genres</button>
    </div>
  )
}

export default Books
