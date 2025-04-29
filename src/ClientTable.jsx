import React from 'react';

export default function ClientTable({ clients, onDelete, onEdit }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
      <thead>
        <tr style={{ background: '#f3f3f3' }}>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Nom</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Email</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Téléphone</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Adresse</th>
          <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{client.nom}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{client.email}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{client.telephone}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>{client.adresse}</td>
            <td style={{ border: '1px solid #ddd', padding: 8 }}>
              <button onClick={() => onEdit(client)} style={{ color: 'white', background: '#ffa500', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Modifier</button>
              <button onClick={() => onDelete(client.id)} style={{ color: 'white', background: 'red', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
