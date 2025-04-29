import React from 'react';

export default function ProductTable({ produits, onDelete, onEdit }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
      <thead>
        <tr style={{ background: '#f3f3f3' }}>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Nom</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Prix</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Description</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {produits.map(produit => (
          <tr key={produit.id}>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{produit.nom}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{produit.prix.toFixed(2)} €</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{produit.description}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>
              <button onClick={() => onEdit(produit)} style={{ color: 'white', background: '#ffa500', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Modifier</button>
              <button onClick={() => onDelete(produit.id)} style={{ color: 'white', background: 'red', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
