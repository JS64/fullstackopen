import React, { useState} from 'react'
import blogService from '../services/blogs'

const Blog = ({ 
  blog,
  setNotification
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const detailsVisible = { display: visible ? '' : 'none' }
  const detailsHidden = { display: visible ? 'none' : '' }
  
  const toggleDetails = () => {
    setVisible(!visible)
  }

  const handleLikes = () => {
    setLikes(likes + 1)
    const updatedObject = {
      user: blog.user.name,
      likes: likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    blogService
      .update(blog.id, updatedObject)
      .then(() => {
        setNotification({ message: `Successfully liked blog post.`, error: false })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
      })
      .catch(error => {
        setLikes(likes)
        setNotification({ message: `Failed to submit like due to: ${error.response.data.error}`, error: true })
        setTimeout(() => {
          setNotification({ message: null, error: false })
        }, 5000)
      })
  }
  
  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author}
        <button onClick={toggleDetails} style={detailsVisible}>Hide</button>
        <button onClick={toggleDetails} style={detailsHidden}>Show</button>
      </p>
      <div style={detailsVisible}>
        <p>{blog.url}</p>
        <p>
          Likes {likes}
          <button onClick={handleLikes}>Like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog
