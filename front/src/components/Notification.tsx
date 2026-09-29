import "./styles/Notification.css";

interface NotificationProps {
  message: string;
  alert?: boolean;
}

export default function Notification({
  message,
  alert,
}: NotificationProps) {

  if (alert) {
    return (
      <div className="alert">
        {message}
      </div>
    )
  }

  return (
    <div className="notification">
      {message}
    </div>
  );
}