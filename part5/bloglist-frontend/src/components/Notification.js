import React from 'react'

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

export default Notification