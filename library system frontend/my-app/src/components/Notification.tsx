import type { Notification as NotificationType } from '../hooks/useNotification';

interface NotificationProps {
  notification: NotificationType;
  onDismiss: () => void;
}

export function Notification({ notification, onDismiss }: NotificationProps) {
  const alertClass = notification.type === 'success' ? 'alert-success' : 
                     notification.type === 'error' ? 'alert-danger' : 'alert-info';

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
        {notification.message}
        <button type="button" className="btn-close" onClick={onDismiss}></button>
      </div>
    </div>
  );
}
