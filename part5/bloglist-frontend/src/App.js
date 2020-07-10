import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const BlogForm = (props) => (
  <form onSubmit={props.addBlog}>
    <div>
      Title: <input value={props.title} onChange={({ target }) => props.setTitle(target.value)} />
    </div>
    <div>
      Author: <input value={props.author} onChange={({ target }) => props.setAuthor(target.value)} />
    </div>
    <div>
      Url: <input value={props.url} onChange={({ target }) => props.setUrl(target.value)} />
    </div>
    <div>
      <button type="submit">Create</button>
    </div>
  </form>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
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
    } catch (exception) {
      console.log("Wrong credentials.")
    }
  }

  const handleLogout = async () => {
    try {
      await window.localStorage.removeItem('loggedInUser')
      setUser(null)
    } catch (exception) {
      console.log(exception.message)
    }
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
      })
      .catch(error => {
        console.log(error.response.data.error)
      })
  }

  const loginForm = () => (
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

  const blogList = (blogs, user) => (
    <>
      <h2>Blogs</h2>
      <p>Logged in as {user.name}<Button text="Log out" onClick={() => handleLogout()} /></p>
      <h2>Create new blog</h2>
      <BlogForm 
        addBlog = {addBlog}
        setTitle = {setTitle}
        setAuthor = {setAuthor}
        setUrl = {setUrl}
        title = {title}
        author = {author}
        url = {url}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  return (
    <div>
      {user === null ? loginForm() : blogList(blogs, user)}
    </div>
  )
}

export default App