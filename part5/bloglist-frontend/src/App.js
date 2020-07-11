import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ user, setUser ] = useState(null)
  const [ notification, setNotification ] = useState({
    message: null,
    error: false
  })

  const blogFormRef = useRef()
  const loginFormRef = useRef()
  
  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      setNotification({ message: `Resuming logged in session.`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await window.localStorage.removeItem('loggedInUser')
      setUser(null)
      setNotification({ message: `Successfully logged out.`, error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    } catch (error) {
      setNotification({ message: `Error: ${error.response.data.error}`, error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="Log in" ref={loginFormRef}>
      <LoginForm 
          setUser = {setUser}
          setNotification = {setNotification}
          loginFormRef = {loginFormRef}
        />
    </Togglable>
  )

  const blogList = (blogs, user) => (
    <>
      <h2>Blogs</h2>
      <p>
        Logged in as {user.name}
        <button onClick={() => handleLogout()}>Log out</button>
      </p>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm 
          blogs = {blogs}
          setBlogs = {setBlogs}
          setNotification = {setNotification}
          blogFormRef = {blogFormRef}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog 
          key = {blog.id} 
          user = {user}
          blog = {blog}
          blogs = {blogs}
          setBlogs = {setBlogs}
          setNotification = {setNotification}
        />
      )}
    </>
  )

  return (
    <div>
      <Notification notification={notification} />
      {user === null ? loginForm() : blogList(blogs, user)}
    </div>
  )
}

export default App