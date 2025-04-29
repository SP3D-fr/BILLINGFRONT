import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './LoginPage';
import PasswordResetRequest from './PasswordResetRequest';
import PasswordResetForm from './PasswordResetForm';
import PasswordResetPage from './PasswordResetPage';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Main() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState(window.location.pathname);

  // Navigation helpers
  const goLogin = () => { window.history.pushState({}, '', '/login'); setRoute('/login'); setUser(null); };
  const goApp = () => { window.history.pushState({}, '', '/'); setRoute('/'); };
  const goReset = (token) => { window.history.pushState({}, '', `/password-reset/${token}`); setRoute(`/password-reset/${token}`); };

  const handleLogout = () => {
    setUser(null);
    goLogin();
  };

  // Au démarrage, tente de restaurer l'utilisateur depuis sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // À chaque changement d'utilisateur, mets à jour sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  // Lors du login, stocke explicitement email, role et token dans user
  const handleLogin = (data) => {
    setUser({ email: data.email, role: data.role, token: data.token });
    sessionStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role, token: data.token }));
    goApp();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset/:token" element={<PasswordResetPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onShowReset={() => setRoute('/reset-request')} />} />
        <Route path="/reset-request" element={<PasswordResetRequest onBack={goLogin} />} />
        <Route path="/password-reset/:token" element={<PasswordResetForm token={route.split('/').pop()} onBack={goLogin} />} />
        {/* Route par défaut : l'app existante */}
        <Route path="*" element={user ? <App user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} onShowReset={() => setRoute('/reset-request')} />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
