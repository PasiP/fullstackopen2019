import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHDATE } from '../queries'
import Select from "react-select"

const Authors = (props) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')
  const token = localStorage.getItem('library-user-token')
  let options = [{ value: 'loading', label: 'Loading' }]
  let authors = []
  const result = useQuery(ALL_AUTHORS)
  const [ editBirthdate ] = useMutation(EDIT_BIRTHDATE, {
    refetchQueries: [ {query: ALL_AUTHORS} ]
  })

  if (!props.show) {
    return null
  }

  if(result.loading || !result) {
    return(
      <div>loading</div>
    )
  } else {
    authors = result.data.allAuthors
    console.log(authors)
    options = authors.map( a => {
      return {value: a.name, label: a.name} })
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('author: ', author ,' born: ', born)
    editBirthdate({ variables: { name: author.value, setBornTo: born } })

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map((a, index) =>
            <tr key={a.name + index}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.authorOf !== undefined ? a.authorOf.length : 'loading'}</td>
            </tr> )}
        </tbody>
      </table>
      { token &&
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit} style={{'maxWidth': '300px'}}>
          <div>
          name
          <Select
            defaultValue={author}
            onChange={setAuthor}
            options={options}
          />
          </div>
          <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn( Number(target.value) )}
              />
            </div>
          <button type="submit" >update author</button>
        </form>
      </div>
      }
    </div>
  )
}

export default Authors
