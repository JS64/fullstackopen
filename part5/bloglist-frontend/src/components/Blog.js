import React, { useState } from 'react'

const Blog = ({
  user,
  blog,
  handleLikes,
  handleRemove
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removable = user.username === blog.user.username

  const [visible, setVisible] = useState(false)

  const detailsVisible = { display: visible ? '' : 'none' }
  const detailsHidden = { display: visible ? 'none' : '' }

  const toggleDetails = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author}
        <button id='hide-button' onClick={toggleDetails} style={detailsVisible}>Hide</button>
        <button id='show-button' onClick={toggleDetails} style={detailsHidden}>Show</button>
      </p>
      <div style={detailsVisible}>
        <p>{blog.url}</p>
        <p>
          Likes <span id='likes-count'>{blog.likes}</span>
          <button id='like-button' onClick={() => handleLikes(blog)}>Like</button>
        </p>
        <p>{blog.user.name}</p>
        {removable &&
          <p>
            <button id='remove-button' onClick={() => handleRemove(blog)}>Remove</button>
          </p>
        }
      </div>
    </div>
  )
}

export default Blog
