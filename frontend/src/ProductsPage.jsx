import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import authFetch from './authFetch';
import ProductTable from './ProductTable';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import Notification from './Notification';

export default function ProductsPage() {
  const theme = useTheme();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notif, setNotif] = useState({ message: '', type: 'success' });

  useEffect(() => {
    authFetch('http://localhost:5000/api/produits')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProduits(data);
        } else {
          setProduits([]);
          setError(data && data.error ? data.error : 'Erreur inattendue');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = (produit) => {
    setProduits(prev => [...prev, produit]);
    setNotif({ message: 'Produit ajouté avec succès', type: 'success' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      const response = await authFetch(`http://localhost:5000/api/produits/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setProduits(prev => prev.filter(p => p.id !== id));
      setNotif({ message: 'Produit supprimé', type: 'success' });
    } catch (err) {
      setNotif({ message: err.message, type: 'error' });
    }
  };

  const handleEditProduct = (produit) => {
    setEditingProduct(produit);
  };

  const handleSaveEdit = (updatedProduct) => {
    setProduits(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setNotif({ message: 'Produit modifié avec succès', type: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleCloseNotif = () => setNotif({ message: '', type: 'success' });

  const exportProduitsCSV = () => {
    window.open('http://localhost:5000/api/export/produits', '_blank');
  }

  if (loading) return <div style={{color: theme.text}}>Chargement des produits...</div>;
  if (error) return <div style={{ color: theme.error }}>Erreur : {error}</div>;

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 900,
    margin: '0 auto',
    padding: 24
  };

  return (
    <div style={cardStyle}>
      <Notification message={notif.message} type={notif.type} onClose={handleCloseNotif} />
      <h2 style={{color: theme.text}}>Liste des produits <button onClick={exportProduitsCSV} style={{marginLeft:16, background:'#ffa500',color:'#222',border:'none',borderRadius:4,padding:'4px 12px',fontWeight:'bold',cursor:'pointer'}}>Exporter CSV</button></h2>
      <div className="card">
        {editingProduct ? (
          <EditProductForm produit={editingProduct} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
        ) : (
          <AddProductForm onAdd={handleAddProduct} />
        )}
      </div>
      <ProductTable produits={Array.isArray(produits) ? produits : []} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
    </div>
  );
}
