import React, { useState } from 'react';
import authFetch from './authFetch';

// Définition de l'URL API globale
const apiUrl = process.env.REACT_APP_API_URL || '';

export default function AddClientForm({ onAdd }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${apiUrl}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, telephone, adresse })
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du client');
      const client = await response.json();
      onAdd(client);
      setNom(''); setEmail(''); setTelephone(''); setAdresse('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'transparent', padding: 0, margin: 0 }}>
      <h3>Ajouter un client</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input required placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} style={{ flex: 2 }} />
        <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
          {loading ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
