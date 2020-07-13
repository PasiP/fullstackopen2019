import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilterText } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    const filterText = event.target.value
    console.log(filterText)
    dispatch(setFilterText(filterText))
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
