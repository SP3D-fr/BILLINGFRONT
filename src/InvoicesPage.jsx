import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import InvoiceTable from './InvoiceTable';
import AddInvoiceForm from './AddInvoiceForm';
import EditInvoiceForm from './EditInvoiceForm';
import Notification from './Notification';
import authFetch from './authFetch';

export default function InvoicesPage() {
  const theme = useTheme();
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [notif, setNotif] = useState({ message: '', type: 'success' });

  useEffect(() => {
    Promise.all([
      authFetch('http://localhost:5000/api/factures').then(res => {
        if (res.status === 401) {
          setError('Erreur d\'autorisation');
          return { error: 'Erreur d\'autorisation' };
        }
        return res.json();
      }),
      authFetch('http://localhost:5000/api/clients').then(res => {
        if (res.status === 401) {
          setError('Erreur d\'autorisation');
          return { error: 'Erreur d\'autorisation' };
        }
        return res.json();
      })
    ])
      .then(([factures, clients]) => {
        setFactures(Array.isArray(factures) ? factures : []);
        setClients(Array.isArray(clients) ? clients : []);
        if (!Array.isArray(factures)) setError(factures && factures.error ? factures.error : 'Erreur inattendue (factures)');
        if (!Array.isArray(clients)) setError(clients && clients.error ? clients.error : 'Erreur inattendue (clients)');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddInvoice = (facture) => {
    setFactures(prev => [...prev, facture]);
    setNotif({ message: 'Facture ajoutée avec succès', type: 'success' });
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Supprimer cette facture ?')) return;
    try {
      const response = await authFetch(`http://localhost:5000/api/factures/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setFactures(prev => prev.filter(f => f.id !== id));
      setNotif({ message: 'Facture supprimée', type: 'success' });
    } catch (err) {
      setNotif({ message: err.message, type: 'error' });
    }
  };

  const handleEditInvoice = (facture) => {
    setEditingInvoice(facture);
  };

  const handleSaveEdit = (updatedFacture) => {
    setFactures(prev => prev.map(f => f.id === updatedFacture.id ? updatedFacture : f));
    setEditingInvoice(null);
    setNotif({ message: 'Facture modifiée avec succès', type: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
  };

  const handleCloseNotif = () => setNotif({ message: '', type: 'success' });

  const exportFacturesCSV = () => {
    window.open('http://localhost:5000/api/export/factures', '_blank');
  };

  // Ajout pour toast après envoi mail
  const handleMailSent = (message, type = 'success') => {
    setNotif({ message, type });
  };

  if (loading) return <div style={{color: theme.text}}>Chargement des factures...</div>;
  if (error) return <div style={{ color: theme.error }}>Erreur : {error}</div>;

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 900,
    margin: '40px auto',
    padding: 32
  };

  return (
    <div style={cardStyle}>
      <Notification
        message={notif.message}
        type={notif.type}
        onClose={handleCloseNotif}
      />
      <h2 style={{color: theme.text}}>Liste des factures <button onClick={exportFacturesCSV} style={{marginLeft:16, background:'#ffa500',color:'#222',border:'none',borderRadius:4,padding:'4px 12px',fontWeight:'bold',cursor:'pointer'}}>Exporter CSV</button></h2>
      <div className="card">
        {editingInvoice ? (
          <EditInvoiceForm facture={editingInvoice} onSave={handleSaveEdit} onCancel={handleCancelEdit} clients={clients} />
        ) : (
          <>
            <AddInvoiceForm clients={clients} onAdd={handleAddInvoice} />
            <InvoiceTable
              factures={factures}
              onDelete={handleDeleteInvoice}
              onEdit={handleEditInvoice}
              onMailSent={handleMailSent}
              clients={clients}
            />
          </>
        )}
      </div>
    </div>
  );
}
