import React, { useState } from 'react';
import authFetch from './authFetch';

export default function AddProductForm({ onAdd }) {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('http://localhost:5000/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prix: parseFloat(prix), description })
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit");
      const produit = await response.json();
      onAdd(produit);
      setNom(''); setPrix(''); setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'transparent', padding: 0, margin: 0 }}>
      <h3 style={{ marginBottom: 8 }}>Ajouter un produit</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input required placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ flex: 2 }} />
        <input required type="number" min="0" step="0.01" placeholder="Prix (€)" value={prix} onChange={e => setPrix(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 3 }} />
        <button type="submit" disabled={loading} style={{ minWidth: 120 }}>
          {loading ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
