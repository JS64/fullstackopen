import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification
  })

  return (
    <div>
      {notification.message &&
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      }
    </div>
  )
}

export default Notification