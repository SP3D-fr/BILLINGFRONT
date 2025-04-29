import React, { useState } from 'react';
import ClientsPage from './ClientsPage';
import ProductsPage from './ProductsPage';
import InvoicesPage from './InvoicesPage';
import StatsPage from './StatsPage';
import SettingsPage from './SettingsPage';
import PrintCalc from './PrintCalc';
import { ThemeProvider, useTheme } from './ThemeContext';
import NavBar from './NavBar';
import './responsive.css';
import './navbar-override.css';
import AdminUserPanel from './AdminUserPanel';

function AppContent({ user, onLogout }) {
  const [page, setPage] = useState('clients');
  const { theme } = useTheme();

  return (
    <>
      <NavBar page={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div style={{marginTop: 64}}>
        <header style={{ background: theme === 'dark' ? '#181818' : '#222', color: 'white', padding: 24, marginBottom: 32 }}>
          <h1 style={{ margin: 0, textAlign: 'center' }}>SP3D Billing WebApp</h1>
        </header>
        {page === 'clients' && <ClientsPage />}
        {page === 'produits' && <ProductsPage />}
        {page === 'factures' && <InvoicesPage />}
        {page === 'stats' && <StatsPage />}
        {page === 'printcalc' && <PrintCalc />}
        {page === 'settings' && <React.Suspense fallback={<div>Chargement…</div>}><SettingsPage /></React.Suspense>}
        {page === 'utilisateurs' && user && user.role === 'admin' && <AdminUserPanel token={user.token} />}
      </div>
      {/* Ajout d'un switch sombre/clair flottant discret, en bas à droite, sans chevaucher la NavBar */}
      <div style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 9999,
        background: 'rgba(24,24,24,0.92)',
        borderRadius: 32,
        boxShadow: '0 2px 12px #0007',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
      }}>
        {require('./ThemeSwitch').default()}
      </div>
    </>
  );
}

function navBtnStyle(active, theme) {
  return {
    marginRight: 16,
    padding: '8px 24px',
    borderRadius: 6,
    border: 'none',
    background: active ? (theme === 'dark' ? '#ffa500' : '#ffa500') : (theme === 'dark' ? '#333' : '#fff'),
    color: active ? '#222' : (theme === 'dark' ? '#fff' : '#222'),
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };
}

export default function App({ user, onLogout }) {
  return (
    <ThemeProvider>
      <AppContent user={user} onLogout={onLogout} />
    </ThemeProvider>
  );
}
