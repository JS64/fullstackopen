import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }
  const notificationClass = !notification.error ? 'notification success' : 'notification error'
  return (
    <div className={notificationClass}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    error: PropTypes.bool.isRequired
  }).isRequired
}

export default Notification