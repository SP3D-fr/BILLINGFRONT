import React, { useEffect, useState } from 'react';

// Utilise l'URL du backend Flask (port 5000)
const API_URL = 'http://localhost:5000/api/users';

export default function AdminUserPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // DEBUG : afficher le token utilisé
  console.log('DEBUG TOKEN:', token);

  // Charger la liste des utilisateurs
  const fetchUsers = async () => {
    setMessage('');
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
    else setMessage("Erreur lors du chargement des utilisateurs");
  };

  useEffect(() => { fetchUsers(); }, []);

  // Ajouter un utilisateur
  const handleAdd = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      setEmail(''); setPassword(''); setRole('user');
      fetchUsers();
      setMessage('Utilisateur ajouté');
    } else setMessage(data.error || data.message || 'Erreur');
  };

  // Modifier le rôle
  const handleRoleChange = async (id, newRole) => {
    setMessage('');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) fetchUsers();
    else setMessage('Erreur lors du changement de rôle');
  };

  // Supprimer un utilisateur
  const handleDelete = async id => {
    setMessage('');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchUsers();
    else setMessage('Erreur lors de la suppression');
  };

  return (
    <div style={{maxWidth:700,margin:'40px auto',padding:32,background:'#222',borderRadius:12,color:'#fff'}}>
      <h2>Gestion des utilisateurs</h2>
      <form onSubmit={handleAdd} style={{display:'flex',gap:8,marginBottom:24}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{flex:2}} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{flex:2}} />
        <select value={role} onChange={e=>setRole(e.target.value)} style={{flex:1}}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" style={{flex:1}}>Ajouter</button>
      </form>
      {message && <div style={{marginBottom:16,color:'#ffa500'}}>{message}</div>}
      <table style={{width:'100%',borderCollapse:'collapse',background:'#333',borderRadius:8}}>
        <thead>
          <tr style={{background:'#444'}}>
            <th style={{padding:8}}>Email</th>
            <th style={{padding:8}}>Rôle</th>
            <th style={{padding:8}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{padding:8}}>{u.email}</td>
              <td style={{padding:8}}>
                <select value={u.role} onChange={e=>handleRoleChange(u.id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td style={{padding:8}}>
                <button onClick={()=>handleDelete(u.id)} style={{color:'#f55',background:'none',border:'none',cursor:'pointer'}}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
