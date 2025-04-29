import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';

export default function Notification({ message, type, onClose }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4800); // start hide before unmount
      const closeTimer = setTimeout(onClose, 5000);
      return () => { clearTimeout(timer); clearTimeout(closeTimer); };
    } else {
      setVisible(false);
    }
  }, [message, onClose]);

  if (!message && !visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: type === 'success' ? theme.success : theme.error,
        color: theme.buttonText,
        padding: '16px 32px',
        borderRadius: 8,
        boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
        zIndex: 1000,
        fontWeight: 'bold',
        fontSize: 18,
        transform: visible ? 'translateX(0)' : 'translateX(400px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(.55,0,.1,1), opacity 0.4s cubic-bezier(.55,0,.1,1)'
      }}
    >
      {message}
      <button onClick={onClose} style={{ marginLeft: 24, background: 'transparent', color: theme.buttonText, border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
    </div>
  );
}
