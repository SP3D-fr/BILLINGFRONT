import React, { useState } from 'react';

export default function LoginPage({ onLogin, onShowReset }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
      // Stocke le token dans sessionStorage
      if (data.token) sessionStorage.setItem('token', data.token);
      onLogin(data); // data: {token, user, role}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', background: '#222', color: '#fff', borderRadius: 8, boxShadow: '0 2px 16px #000a', padding: 32 }}>
      <h2 style={{textAlign:'center'}}>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <label>Email<br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:'100%',padding:8,marginTop:4,marginBottom:12,borderRadius:4,border:'1px solid #888',background:'#181818',color:'#fff'}} />
        </label>
        <label>Mot de passe<br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%',padding:8,marginTop:4,marginBottom:12,borderRadius:4,border:'1px solid #888',background:'#181818',color:'#fff'}} />
        </label>
        {error && <div style={{color:'#ffa500',marginBottom:8}}>{error}</div>}
        <button type="submit" disabled={loading} style={{width:'100%',padding:10,background:'#ffa500',color:'#222',fontWeight:700,border:'none',borderRadius:4,marginTop:8}}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <div style={{marginTop:18,textAlign:'center'}}>
        <button onClick={onShowReset} style={{background:'none',color:'#ffa500',border:'none',cursor:'pointer',textDecoration:'underline'}}>Mot de passe oublié ?</button>
      </div>
    </div>
  );
}
