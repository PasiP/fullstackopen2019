import React from 'react'
import Alert from '@material-ui/lab/Alert'

const Notification = ({ message }) => {

  if (message === null) {
    return null
  } else if(message[1] === 'err') {
    return (
      <Alert
        severity="error"
        className="notification">
        {message[0]}
      </Alert>
    )
  } else if(message[1] === 'hidden') {
    return (
      <div className="hidden">
        {message[0]}
      </div>
    )
  } else {
    return (
      <Alert
        severity="success"
        className="notification">
        {message[0]}
      </Alert>
    )
  }
}

export default Notification
