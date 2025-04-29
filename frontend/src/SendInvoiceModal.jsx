import React, { useState } from 'react';
import authFetch from './authFetch';

export default function SendInvoiceModal({ open, onClose, facture, onSuccess }) {
  const [message, setMessage] = useState('Bonjour, veuillez trouver votre facture en pièce jointe.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`http://localhost:5000/api/factures/${facture.id}/send_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi du mail');
      // Succès : fermer la modale et notifier le parent
      onClose && onClose();
      onSuccess && onSuccess('Mail envoyé avec succès !', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 32, minWidth: 350, maxWidth: 450, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <h2>Envoyer la facture par mail</h2>
        <form onSubmit={handleSend}>
          <div style={{ marginBottom: 16 }}>
            <label>Texte du mail :</label><br />
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} style={{ width: '100%', borderRadius: 4, border: '1px solid #ccc', padding: 8 }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Annuler</button>
            <button type="submit" disabled={loading} style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
