import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import authFetch from './authFetch';
import ClientTable from './ClientTable';
import AddClientForm from './AddClientForm';
import EditClientForm from './EditClientForm';
import Notification from './Notification';

const apiUrl = process.env.REACT_APP_API_URL || '';

function exportClientsCSV() {
  window.open(`${apiUrl}/api/export/clients`, '_blank');
}

export default function ClientsPage() {
  const theme = useTheme();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [notif, setNotif] = useState({ message: '', type: 'success' });

  useEffect(() => {
    authFetch(`${apiUrl}/api/clients`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data);
        else setClients([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddClient = (client) => {
    setClients((prev) => [...prev, client]);
    setNotif({ message: 'Client ajouté avec succès', type: 'success' });
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      const response = await fetch(`${apiUrl}/api/clients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setClients((prev) => prev.filter((c) => c.id !== id));
      setNotif({ message: 'Client supprimé', type: 'success' });
    } catch (err) {
      setNotif({ message: err.message, type: 'error' });
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleSaveEdit = (updatedClient) => {
    setClients((prev) => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
    setNotif({ message: 'Client modifié avec succès', type: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  const handleCloseNotif = () => setNotif({ message: '', type: 'success' });

  if (loading) return <div style={{color: theme.text}}>Chargement des clients...</div>;
  if (error) return <div style={{ color: theme.error }}>Erreur : {error}</div>;

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 1000,
    margin: '40px auto',
    padding: 32
  };

  return (
    <div style={cardStyle}>
      <h2 style={{color: theme.text}}>Liste des clients <button onClick={exportClientsCSV} style={{ background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}`, marginLeft: 16, float: 'right', marginTop: -40 }}>Exporter CSV</button></h2>
      <Notification message={notif.message} type={notif.type} onClose={handleCloseNotif} />
      <div className="card">
        {editingClient ? (
          <EditClientForm client={editingClient} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
        ) : (
          <AddClientForm onAdd={handleAddClient} />
        )}
      </div>
      <ClientTable clients={clients} onDelete={handleDeleteClient} onEdit={handleEditClient} />
    </div>
  );
}
