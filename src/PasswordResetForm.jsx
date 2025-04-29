import React, { useState } from 'react';

export default function PasswordResetForm({ token, onBack }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mot de passe trop court (min 6 caractères)');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/password-reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error('Lien expiré ou invalide');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ maxWidth: 360, margin: '60px auto', background: '#222', color: '#fff', borderRadius: 8, boxShadow: '0 2px 16px #000a', padding: 32, textAlign:'center' }}>
      <h2>Mot de passe réinitialisé !</h2>
      <div style={{margin:'24px 0'}}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</div>
      <button onClick={onBack} style={{background:'#ffa500',color:'#222',fontWeight:700,border:'none',borderRadius:4,padding:'10px 24px'}}>Retour à la connexion</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', background: '#222', color: '#fff', borderRadius: 8, boxShadow: '0 2px 16px #000a', padding: 32 }}>
      <h2 style={{textAlign:'center'}}>Nouveau mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label>Nouveau mot de passe<br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%',padding:8,marginTop:4,marginBottom:12,borderRadius:4,border:'1px solid #888',background:'#181818',color:'#fff'}} />
        </label>
        <label>Confirmer le mot de passe<br/>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{width:'100%',padding:8,marginTop:4,marginBottom:12,borderRadius:4,border:'1px solid #888',background:'#181818',color:'#fff'}} />
        </label>
        {error && <div style={{color:'#ffa500',marginBottom:8}}>{error}</div>}
        <button type="submit" disabled={loading} style={{width:'100%',padding:10,background:'#ffa500',color:'#222',fontWeight:700,border:'none',borderRadius:4,marginTop:8}}>
          {loading ? 'Réinitialisation...' : 'Réinitialiser'}
        </button>
      </form>
      <div style={{marginTop:18,textAlign:'center'}}>
        <button onClick={onBack} style={{background:'none',color:'#ffa500',border:'none',cursor:'pointer',textDecoration:'underline'}}>Retour</button>
      </div>
    </div>
  );
}
