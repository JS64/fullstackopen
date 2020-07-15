import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

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
      setBlogs([...blogs].sort((a,b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      setNotification({ message: 'Resuming logged in session.', error: false })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 5000)
    }
  }, [])

  const logout = async () => {
    try {
      await window.localStorage.removeItem('loggedInUser')
      setUser(null)
      setNotification({ message: 'Successfully logged out.', error: false })
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

  const login = async (credentials) => {
    loginFormRef.current.toggleVisibility()
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
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

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification({ message: `Added new blog: ${returnedBlog.title} by ${returnedBlog.author}`, error: false })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
      })
      .catch(error => {
        setNotification({ message: `Failed to add blog: ${error.response.data.error}`, error: true })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
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
        setNotification({ message: 'Successfully liked blog post.', error: false })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
      })
      .catch(error => {
        setNotification({ message: `Failed to submit like due to: ${error.response.data.error}`, error: true })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
      })
  })

  const handleRemove = (blog) => {
    const confirmation = window.confirm(`Delete '${blog.title}' by ${blog.author}?`)
    if (confirmation) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(a => a.id !== blog.id))
          setNotification({ message: `'${blog.title}' by ${blog.author} has been successfully deleted.`, error: false })
          setTimeout(() => {
            setNotification({ message: null, error: false })
          }, 5000)
        })
        .catch(error => {
          setBlogs(blogs.filter(a => a.id !== blog.id))
          setNotification({ message: `Cannot delete '${blog.title}' by ${blog.author}. Reason: ${error.response.data.error}.`, error: true })
          setTimeout(() => {
            setNotification({ message: null, error: false })
          }, 5000)
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