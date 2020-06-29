import React from 'react'
import PropTypes from 'prop-types'

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
          username
          <input
            id='username'
            {...username} />
        </div>
        <div>
          password
          <input
            id='password'
            {...password} />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm
