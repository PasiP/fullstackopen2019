import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@material-ui/core'

const LoginForm = ({
  handleSubmit,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Username"
            variant="outlined"
            id='username'
            {...username} />
        </div>
        <div>
          <TextField
            label="Password"
            variant="outlined"
            id='password'
            {...password} />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="login-button"
          type="submit">login</Button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm
