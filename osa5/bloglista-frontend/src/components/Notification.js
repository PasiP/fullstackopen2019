import React from 'react'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else if(message[1] === 'err') {
    return (
      <div className="error">
        {message[0]}
      </div>
    )
  } else {
    return (
      <div className="notification">
        {message[0]}
      </div>
    )
  }
}

export default Notification
