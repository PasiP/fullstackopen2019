import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const Recommendations = ({show, allBooks}) => {
  const [books, setBooks] = useState([])
  const result = useQuery(ME)

  useEffect(() => {
    if(result.loading === false && result.data) {
        setBooks(allBooks.filter(b => b.genres.includes(result.data.me.favoriteGenre)))
      }
  }, [result.loading, result.data, allBooks])

  if (!show) {
    return null
  }

  if(!result) {
    return(
      <div>
        <h2>recommendations</h2>
        loading
      </div>
    )
  }

  return(
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{result.data.me.favoriteGenre}</b></p>
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
    </div>
  )
}

export default Recommendations
