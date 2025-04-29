import React from 'react';
import { useTheme } from './ThemeContext';
import './ThemeSwitch.css';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="theme-switch-wrapper">
      <span className="theme-icon">🌞</span>
      <label className="theme-switch">
        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
        <span className="slider"></span>
      </label>
      <span className="theme-icon">🌙</span>
    </div>
  );
}
