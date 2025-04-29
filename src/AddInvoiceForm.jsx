import React, { useState, useEffect } from 'react';
import authFetch from './authFetch';

export default function AddInvoiceForm({ clients, onAdd }) {
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [statut, setStatut] = useState('En attente');
  const [allProducts, setAllProducts] = useState([]);
  const [lignes, setLignes] = useState([]); // [{produit_id, quantite, prix_unitaire}]
  const [reductionType, setReductionType] = useState('euro');
  const [reductionValue, setReductionValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  // Sécurise clients pour éviter l'erreur .map
  const safeClients = Array.isArray(clients) ? clients : [];

  useEffect(() => {
    if (safeClients.length > 0 && !clientId) {
      setClientId(safeClients[0].id);
    }
    authFetch(`${apiUrl}/api/produits`)
      .then(res => res.json())
      .then(setAllProducts);
  }, [safeClients, clientId]);

  // Calcul du total brut
  const totalBrut = lignes.reduce((sum, l) => sum + (l.prix_unitaire * l.quantite), 0);
  // Application réduction
  let total = totalBrut;
  if (reductionType === 'percent') total = total * (1 - (parseFloat(reductionValue) || 0) / 100);
  else total = Math.max(0, totalBrut - (parseFloat(reductionValue) || 0));

  const handleChangeLigne = (idx, field, value) => {
    setLignes(lignes => lignes.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };
  const handleAddLigne = () => {
    setLignes([...lignes, { produit_id: allProducts[0]?.id || '', quantite: 1, prix_unitaire: allProducts[0]?.prix || 0 }]);
  };
  const handleRemoveLigne = (idx) => {
    setLignes(lignes => lignes.filter((_, i) => i !== idx));
  };
  const handleProductChange = (idx, produit_id) => {
    const prod = allProducts.find(p => p.id === parseInt(produit_id));
    setLignes(lignes => lignes.map((l, i) => i === idx ? { ...l, produit_id, prix_unitaire: prod ? prod.prix : 0 } : l));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${apiUrl}/api/factures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          date,
          statut,
          lignes: lignes.map(l => ({
            produit_id: parseInt(l.produit_id),
            quantite: parseInt(l.quantite),
            prix_unitaire: parseFloat(l.prix_unitaire)
          })),
          reduction_type: reductionType,
          reduction_value: parseFloat(reductionValue)
        })
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout de la facture");
      const facture = await response.json();
      onAdd(facture);
      setClientId(''); setDate(''); setLignes([]); setStatut('En attente'); setReductionType('euro'); setReductionValue(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: 'transparent', padding: 16, borderRadius: 8 }}>
      <h3>Ajouter une facture</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select required value={clientId} onChange={e => setClientId(e.target.value)} style={{ flex: 2 }}>
          {safeClients.map(client => (
            <option key={client.id} value={client.id}>{client.nom}</option>
          ))}
        </select>
        <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 2 }} />
        <select value={statut} onChange={e => setStatut(e.target.value)} style={{ flex: 1 }}>
          <option value="En attente">En attente</option>
          <option value="Payée">Payée</option>
        </select>
      </div>
      <div style={{ margin: '16px 0' }}>
        <table style={{ width: '100%', background: 'transparent' }}>
          <thead>
            <tr style={{ background: 'var(--table-header-bg)' }}>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire (€)</th>
              <th>Sous-total (€)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne, idx) => (
              <tr key={idx}>
                <td>
                  <select value={ligne.produit_id} onChange={e => handleProductChange(idx, e.target.value)} required>
                    {allProducts.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.nom}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="number" min="1" value={ligne.quantite} onChange={e => handleChangeLigne(idx, 'quantite', e.target.value)} style={{ width: 60 }} required />
                </td>
                <td>
                  <input type="number" min="0" step="0.01" value={ligne.prix_unitaire} onChange={e => handleChangeLigne(idx, 'prix_unitaire', e.target.value)} style={{ width: 90 }} required />
                </td>
                <td>{(ligne.quantite * ligne.prix_unitaire).toFixed(2)}</td>
                <td>
                  <button type="button" onClick={() => handleRemoveLigne(idx)} style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddLigne} style={{ marginTop: 8, background: '#ffa500', color: '#222', border: 'none', borderRadius: 4, padding: '4px 14px', fontWeight: 'bold', cursor: 'pointer' }}>+ Ajouter un produit</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
        <span>Réduction :</span>
        <input type="number" min="0" value={reductionValue} onChange={e => setReductionValue(e.target.value)} style={{ width: 80 }} />
        <select value={reductionType} onChange={e => setReductionType(e.target.value)}>
          <option value="euro">€</option>
          <option value="percent">%</option>
        </select>
      </div>
      <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        Total : {total.toFixed(2)} €
      </div>
      <button type="submit" disabled={loading || lignes.length === 0} style={{ minWidth: 130 }}>
        {loading ? 'Ajout...' : 'Ajouter la facture'}
      </button>
      {error && <div style={{ color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
    </form>
  );
}
