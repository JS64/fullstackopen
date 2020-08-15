import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import storage from './utils/storage'
import {
  Container,
  CssBaseline,
} from '@material-ui/core'

import { notifySuccess, notifyError } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'


const App = () => {
  const dispatch = useDispatch()
  const [ blogs, setBlogs ] = useState([])
  const [ user, setUser ] = useState(null)

  const blogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs([...blogs].sort((a,b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const user = storage.loadUser()
    setUser(user)
  }, [])

  const logout = async () => {
    try {
      setUser(null)
      storage.logoutUser()
      dispatch(notifyError('Successfully logged out.', 5))
    } catch (error) {
      dispatch(notifyError(`Error: ${error.response.data.error}`, 5))
    }
  }

  const login = async (credentials) => {
    loginFormRef.current.toggleVisibility()
    try {
      const user = await loginService.login(credentials)
      storage.saveUser(user)
      setUser(user)
      dispatch(notifySuccess('Successfully logged in.', 5))
    } catch (error) {
      dispatch(notifyError('Incorrect credentials.', 5))
    }
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        dispatch(notifySuccess(`Added new blog: ${returnedBlog.title} by ${returnedBlog.author}`, 5))
      })
      .catch(error => {
        dispatch(notifyError(`Failed to add blog: ${error.response.data.error}`, 5))
      })
  }

  const handleLikes = (blog => {
    const updatedObject = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id,
      user: blog.user
    }

    const updatedBlogs = [...blogs].map(blog => {
      if (blog.id === updatedObject.id)
        return updatedObject
      return blog
    })

    blogService
      .update(blog.id, updatedObject)
      .then(() => {
        setBlogs(updatedBlogs.sort((a,b) => b.likes - a.likes))
        dispatch(notifySuccess('Successfully liked blog post.', 5))
      })
      .catch(error => {
        dispatch(notifyError(`Failed to submit like due to: ${error.response.data.error}`, 5))
      })
  })

  const handleRemove = (blog) => {
    const confirmation = window.confirm(`Delete '${blog.title}' by ${blog.author}?`)
    if (confirmation) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(a => a.id !== blog.id))
          dispatch(notifySuccess(`'${blog.title}' by ${blog.author} has been successfully deleted.`, 5))
        })
        .catch(error => {
          setBlogs(blogs.filter(a => a.id !== blog.id))
          dispatch(notifyError(`Cannot delete '${blog.title}' by ${blog.author}. Reason: ${error.response.data.error}.`, 5))
        })
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="Log in" ref={loginFormRef}>
      <LoginForm
        login = {login}
        loginFormRef = {loginFormRef}
      />
    </Togglable>
  )

  const blogList = (blogs, user) => (
    <>
      <h2>Blogs</h2>
      <p>
        Logged in as {user.name}
        <button onClick={() => logout()}>Log out</button>
      </p>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm
          createBlog = {createBlog}
          blogFormRef = {blogFormRef}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key = {blog.id}
          user = {user}
          blog = {blog}
          handleLikes = {handleLikes}
          handleRemove = {handleRemove}
          removable = {user.username === blog.user.username}
        />
      )}
    </>
  )

  return (
    <Container>
      <CssBaseline />
      <Notification />
      {user === null ? loginForm() : blogList(blogs, user)}
    </Container>
  )
}

export default App