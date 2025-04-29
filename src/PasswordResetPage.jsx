import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PasswordResetPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`/api/password-reset/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setMessage('Mot de passe réinitialisé. Vous pouvez vous connecter.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMessage(data.error || 'Erreur lors de la réinitialisation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'64px auto',padding:32,background:'#222',borderRadius:10,color:'#fff',boxShadow:'0 2px 16px #0008'}}>
      <h2>Réinitialiser le mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{width:'100%',padding:10,margin:'16px 0',borderRadius:6,border:'none',fontSize:16}}
      />
      <button type="submit" style={{width:'100%',padding:10,borderRadius:6,background:'#ffa500',color:'#222',fontWeight:700,fontSize:16,border:'none',cursor:'pointer'}}>Valider</button>
      {message && <div style={{marginTop:16,color:success?'#0f0':'#f55'}}>{message}</div>}
    </form>
  );
}
