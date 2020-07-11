import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({
    blogs,
    setBlogs,
    setNotification,
    blogFormRef
  }) => {
    const [ title, setTitle ] = useState('') 
    const [ author, setAuthor ] = useState('')
    const [ url, setUrl ] = useState('')
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }
    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        blogFormRef.current.toggleVisibility()
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
  
    return (
        <>
            <h2>Create new blog</h2>
            <form onSubmit={addBlog}>
            <div>
                Title: <input value={title} onChange={handleTitleChange} />
            </div>
            <div>
                Author: <input value={author} onChange={handleAuthorChange} />
            </div>
            <div>
                Url: <input value={url} onChange={handleUrlChange} />
            </div>
            <div>
                <button type="submit">Create</button>
            </div>
            </form>
        </>
    )
  }

  export default BlogForm