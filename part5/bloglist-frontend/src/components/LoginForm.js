import React, { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const LoginForm = ({
  setUser,
  setNotification,
  loginFormRef
}) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()
    loginFormRef.current.toggleVisibility()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Successfully logged in.', error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    } catch (error) {
      setNotification({ message: 'Incorrect credentials.', error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
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
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  loginFormRef: PropTypes.func.isRequired
}

export default LoginForm