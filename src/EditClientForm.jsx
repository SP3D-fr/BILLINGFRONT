import React, { useState } from 'react';

export default function EditClientForm({ client, onSave, onCancel }) {
  const [nom, setNom] = useState(client.nom);
  const [email, setEmail] = useState(client.email || '');
  const [telephone, setTelephone] = useState(client.telephone || '');
  const [adresse, setAdresse] = useState(client.adresse || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, telephone, adresse })
      });
      if (!response.ok) throw new Error("Erreur lors de la modification du client");
      const updated = await response.json();
      onSave(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'transparent', padding: 0, margin: 0 }}>
      <h3>Modifier le client</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input required placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} style={{ flex: 2 }} />
        <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
          {loading ? 'Modification...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={onCancel} style={{ minWidth: 100 }}>
          Annuler
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
