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
        <button onClick={toggleDetails} style={detailsVisible}>Hide</button>
        <button onClick={toggleDetails} style={detailsHidden}>Show</button>
      </p>
      <div style={detailsVisible}>
        <p>{blog.url}</p>
        <p>
          Likes {blog.likes}
          <button onClick={() => handleLikes(blog)}>Like</button>
        </p>
        <p>{blog.user.name}</p>
        {removable &&
          <p>
            <button onClick={() => handleRemove(blog)}>Remove</button>
          </p>
        }
      </div>
    </div>
  )
}

export default Blog
