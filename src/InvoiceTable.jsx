import React, { useState } from 'react';
import SendInvoiceModal from './SendInvoiceModal';

export default function InvoiceTable({ factures, onDelete, onEdit, onMailSent }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);

  const handleDownloadPDF = (id) => {
    window.open(`http://localhost:5000/api/factures/${id}/pdf`, '_blank');
  };

  const handleSendMail = (facture) => {
    setSelectedFacture(facture);
    setModalOpen(true);
  };

  const handleMailSuccess = (message, type) => {
    setModalOpen(false);
    onMailSent && onMailSent(message, type);
  };

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f3f3f3' }}>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Client</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Montant (€)</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Statut</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map(facture => (
            <tr key={facture.id}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{facture.client_nom || facture.client_id}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{facture.date}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{facture.montant.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{facture.statut}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>
                <button onClick={() => onEdit(facture)} style={{ color: 'white', background: '#ffa500', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Modifier</button>
                <button onClick={() => onDelete(facture.id)} style={{ color: 'white', background: 'red', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Supprimer</button>
                <button onClick={() => handleDownloadPDF(facture.id)} style={{ color: 'white', background: '#28a745', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Télécharger PDF</button>
                <button onClick={() => handleSendMail(facture)} style={{ color: 'white', background: '#007bff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Envoyer par mail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SendInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} facture={selectedFacture} onSuccess={handleMailSuccess} />
    </>
  );
}
