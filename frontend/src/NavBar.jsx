import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import './navbar-actions.css';

const NAV_LINKS = [
  { key: 'clients', label: 'Clients' },
  { key: 'produits', label: 'Produits' },
  { key: 'factures', label: 'Factures' },
  { key: 'stats', label: 'Statistiques' },
  { key: 'settings', label: 'Paramètres' },
  { key: 'printcalc', label: 'Impression 3D' },
];

export default function NavBar({ page, setPage, onLogout, user }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.mode === 'dark' ? '#181818' : theme.card,
    color: theme.mode === 'dark' ? '#fff' : theme.text,
    padding: '0 16px',
    height: 56,
    borderBottom: `1px solid ${theme.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  // Couleurs fixes pour contraste maximal
  const menuBg = theme.mode === 'dark' ? '#181818' : '#fff';
  const menuBorder = theme.mode === 'dark' ? '#444' : '#e0e0e0';
  const navBtnColor = '#fff';
  const navBtnInactiveColor = theme.mode === 'dark' ? '#fff' : '#222';
  const navBtnActiveBg = theme.mode === 'dark' ? '#ffa500' : '#1565c0';
  const navBtnActiveColor = '#fff';
  const navBtnActiveBorder = theme.mode === 'dark' ? '#ffa500' : '#1565c0';

  return (
    <nav style={navStyle}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <button
          className="burger"
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'none',
            background: theme.mode === 'dark' ? '#333' : '#ddd',
            border: `1px solid ${theme.mode === 'dark' ? '#555' : '#ccc'}`,
            fontSize: 28,
            cursor: 'pointer',
            marginRight: 8,
            padding: 4,
            borderRadius: 4,
            color: navBtnColor
          }}
        >☰</button>
        <span style={{ fontWeight: 700, fontSize: 20, color: navBtnColor }}>Billing 3D</span>
      </div>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {NAV_LINKS.map(link => {
          const isActive = page === link.key;
          return (
            <button
              key={link.key}
              onClick={() => setPage(link.key)}
              style={{
                background: isActive ? navBtnActiveBg : 'transparent',
                color: isActive ? navBtnActiveColor : navBtnInactiveColor,
                border: isActive ? `2px solid ${navBtnActiveBorder}` : 'none',
                fontWeight: isActive ? 700 : 400,
                fontSize: 16,
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 6,
                margin: 0,
                outline: 'none',
                transition: 'background 0.2s, color 0.2s',
                boxShadow: isActive && theme.mode === 'dark' ? '0 0 0 2px #222' : undefined,
                zIndex: 10,
              }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.background = theme.mode === 'dark' ? '#333' : '#eee'; e.currentTarget.style.color = navBtnColor; }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = navBtnInactiveColor; } }}
            >{link.label}</button>
          );
        })}
        {user && user.role === 'admin' && (
          <button
            key="utilisateurs"
            onClick={() => setPage('utilisateurs')}
            style={{
              background: page === 'utilisateurs' ? navBtnActiveBg : 'transparent',
              color: page === 'utilisateurs' ? navBtnActiveColor : navBtnInactiveColor,
              border: page === 'utilisateurs' ? `2px solid ${navBtnActiveBorder}` : 'none',
              fontWeight: page === 'utilisateurs' ? 700 : 400,
              fontSize: 16,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 6,
              margin: 0,
              outline: 'none',
              transition: 'background 0.2s, color 0.2s',
              boxShadow: page === 'utilisateurs' && theme.mode === 'dark' ? '0 0 0 2px #222' : undefined,
              zIndex: 10,
            }}
            onMouseOver={e => { if (page !== 'utilisateurs') e.currentTarget.style.background = theme.mode === 'dark' ? '#333' : '#eee'; e.currentTarget.style.color = navBtnColor; }}
            onMouseOut={e => { if (page !== 'utilisateurs') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = navBtnInactiveColor; } }}
          >Utilisateurs</button>
        )}
      </div>
      <div style={{marginLeft: 8}}>
        {user && (
          <button
            onClick={onLogout}
            style={{
              background: '#ffa500',
              color: '#222',
              fontWeight: 700,
              border: 'none',
              borderRadius: 4,
              padding: '7px 18px',
              cursor: 'pointer',
              fontSize: 16,
              boxShadow: '0 0 2px #0008',
            }}
          >
            Déconnexion
          </button>
        )}
      </div>
      {/* Menu mobile */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            width: '100vw',
            background: menuBg,
            color: navBtnColor,
            borderTop: `1px solid ${menuBorder}`,
            borderBottom: `2px solid ${menuBorder}`,
            zIndex: 200,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            boxShadow: theme.mode === 'dark' ? '0 2px 16px #000b' : '0 2px 12px #bbb8',
            opacity: 1,
          }}
        >
          {NAV_LINKS.map(link => {
            const isActive = page === link.key;
            return (
              <button
                key={link.key}
                onClick={() => { setPage(link.key); setOpen(false); }}
                style={{
                  background: isActive ? navBtnActiveBg : 'transparent',
                  color: isActive ? navBtnActiveColor : navBtnInactiveColor,
                  border: isActive ? `2px solid ${navBtnActiveBorder}` : 'none',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 18,
                  textAlign: 'left',
                  padding: '10px 8px',
                  borderRadius: 6,
                  margin: 0,
                  outline: 'none',
                  transition: 'background 0.2s, color 0.2s',
                  boxShadow: isActive && theme.mode === 'dark' ? '0 0 0 2px #222' : undefined,
                  zIndex: 10,
                }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = theme.mode === 'dark' ? '#333' : '#eee'; e.currentTarget.style.color = navBtnColor; }}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = navBtnInactiveColor; } }}
              >{link.label}</button>
            );
          })}
          {user && user.role === 'admin' && (
            <button
              key="utilisateurs"
              onClick={() => { setPage('utilisateurs'); setOpen(false); }}
              style={{
                background: page === 'utilisateurs' ? navBtnActiveBg : 'transparent',
                color: page === 'utilisateurs' ? navBtnActiveColor : navBtnInactiveColor,
                border: page === 'utilisateurs' ? `2px solid ${navBtnActiveBorder}` : 'none',
                fontWeight: page === 'utilisateurs' ? 700 : 400,
                fontSize: 18,
                textAlign: 'left',
                padding: '10px 8px',
                borderRadius: 6,
                margin: 0,
                outline: 'none',
                transition: 'background 0.2s, color 0.2s',
                boxShadow: page === 'utilisateurs' && theme.mode === 'dark' ? '0 0 0 2px #222' : undefined,
                zIndex: 10,
              }}
              onMouseOver={e => { if (page !== 'utilisateurs') e.currentTarget.style.background = theme.mode === 'dark' ? '#333' : '#eee'; e.currentTarget.style.color = navBtnColor; }}
              onMouseOut={e => { if (page !== 'utilisateurs') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = navBtnInactiveColor; } }}
            >Utilisateurs</button>
          )}
          <div style={{marginTop: 16}}></div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .burger { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-links { display: flex !important; }
          .burger { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
