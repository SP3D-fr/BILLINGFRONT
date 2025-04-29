import React, { useState } from 'react';
import authFetch from './authFetch';

export default function EditProductForm({ produit, onSave, onCancel }) {
  const [nom, setNom] = useState(produit.nom);
  const [prix, setPrix] = useState(produit.prix);
  const [description, setDescription] = useState(produit.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`http://localhost:5000/api/produits/${produit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prix: parseFloat(prix), description })
      });
      if (!response.ok) throw new Error("Erreur lors de la modification du produit");
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
      <h3 style={{ marginBottom: 8 }}>Modifier le produit</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input required placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ flex: 2 }} />
        <input required type="number" min="0" step="0.01" placeholder="Prix (€)" value={prix} onChange={e => setPrix(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 3 }} />
        <button type="submit" disabled={loading} style={{ minWidth: 120, background: '#ffc107', color: '#222', border: 'none', borderRadius: 4 }}>
          {loading ? 'Modification...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={onCancel} style={{ minWidth: 100, background: '#eee', color: '#222', border: 'none', borderRadius: 4 }}>
          Annuler
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
