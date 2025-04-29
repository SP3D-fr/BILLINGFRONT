import React, { useState } from 'react';

export default function PasswordResetRequest({ onBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/password-reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Aucun compte avec cet email.');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', background: '#222', color: '#fff', borderRadius: 8, boxShadow: '0 2px 16px #000a', padding: 32 }}>
      <h2 style={{textAlign:'center'}}>Réinitialisation du mot de passe</h2>
      {sent ? (
        <div style={{color:'#ffa500',textAlign:'center',marginTop:32}}>
          Un email de réinitialisation a été envoyé.<br/>Vérifiez votre boîte mail.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Email<br/>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:'100%',padding:8,marginTop:4,marginBottom:12,borderRadius:4,border:'1px solid #888',background:'#181818',color:'#fff'}} />
          </label>
          {error && <div style={{color:'#ffa500',marginBottom:8}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:10,background:'#ffa500',color:'#222',fontWeight:700,border:'none',borderRadius:4,marginTop:8}}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
      )}
      <div style={{marginTop:18,textAlign:'center'}}>
        <button onClick={onBack} style={{background:'none',color:'#ffa500',border:'none',cursor:'pointer',textDecoration:'underline'}}>Retour</button>
      </div>
    </div>
  );
}
