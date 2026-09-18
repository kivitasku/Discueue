import { useEffect, useState } from "react";
import "./SideMenu.css";



interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SideMenu({
  isOpen,
  onClose,
  title,
  children,
}: SideMenuProps) {
  const [visible, setVisible] = useState(isOpen);

useEffect(() => {
  if (isOpen) {
    setVisible(true);
  } else {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 200);

    return () => clearTimeout(timer);
  }
}, [isOpen]);


if (!visible) {
  return null;
}




  return (
    <div className="menu-overlay" onClick={onClose}>
      <div
        className={`menu-panel ${isOpen ? "open" : "closing"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="menu-header">
          <h2>{title}</h2>

          <button
            className="menu-close-button"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="menu-content">
          {children}
        </div>

      </div>
    </div>
  );
}