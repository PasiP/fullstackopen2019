import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return(
    <li key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes} &nbsp;
        <button onClick={() => vote(anecdote) }>vote</button>
      </div>
    </li>
  )
}

const Anecdotes = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  console.log("anecdotes: ", anecdotes)
  const textFilter = useSelector(state => state.filter).toLowerCase()
  const anecdotesToShow = anecdotes.filter(anecdote => anecdote.content.toLowerCase().search(textFilter) !== -1)

  return(
    <ul>
      {anecdotesToShow.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
        />
      )}
    </ul>
  )
}

export default Anecdotes
