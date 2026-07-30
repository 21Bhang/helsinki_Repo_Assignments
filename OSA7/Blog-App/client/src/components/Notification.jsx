import useNotificationStore from '../store/notificationStore'

const Notification = () => {
  const message = useNotificationStore((s) => s.message)
  const type = useNotificationStore((s) => s.type)

  if (!message) return null

  return (
    <div className={`notification notification--${type}`} role="status">
      {message}
    </div>
  )
}

export default Notification
