import { useEffect, useState } from "react";

interface Notification {
  message: string;
  alert?: boolean;
}

export function useNotification() {
  const [notification, setNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = setTimeout(() => {
      setNotification(null);
    }, 2900);

    return () => clearTimeout(timeout);
  }, [notification]);

  const showNotification = (message: string, alert = false) => {
    setNotification({
      message,
      alert,
    });
  };

  return {
    notification,
    showNotification,
  };
}