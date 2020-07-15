import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const handleLogin = (event) => {
    event.preventDefault()
    login({
      username: username,
      password: password,
    })
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h2>Log in to Application</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  loginFormRef: PropTypes.object.isRequired
}

export default LoginForm