import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

function PrintCalcHistory({ onBack }) {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calcul-historique")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Supprimer ce calcul ?")) return;
    fetch(`/api/calcul-historique/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setHistory(history.filter((h) => h.id !== id)));
  };

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 900,
    margin: "40px auto",
    padding: 24
  };
  const thStyle = {
    background: theme.mode === 'dark' ? '#222' : '#f0f0f0',
    color: theme.text,
    padding: 6
  };
  const tdStyle = {
    background: theme.card,
    color: theme.text,
    padding: 6,
    borderBottom: `1px solid ${theme.border}`
  };

  return (
    <div style={cardStyle}>
      <h2 style={{color: theme.text}}>Historique des calculs impression 3D</h2>
      <button onClick={onBack} style={{ marginBottom: 16, background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}` }}>Retour</button>
      {loading ? (
        <div style={{color: theme.text}}>Chargement…</div>
      ) : history.length === 0 ? (
        <div style={{color: theme.text}}>Aucun calcul enregistré.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Nom produit</th>
              <th style={thStyle}>Temps (h)</th>
              <th style={thStyle}>Poids (g)</th>
              <th style={thStyle}>Marge (%)</th>
              <th style={thStyle}>Prix final (€)</th>
              <th style={thStyle}>Prix arrondi (€)</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td style={tdStyle}>{new Date(h.date).toLocaleString()}</td>
                <td style={tdStyle}>{h.nom_produit}</td>
                <td style={tdStyle}>{h.temps_impression}</td>
                <td style={tdStyle}>{h.poids_filament}</td>
                <td style={tdStyle}>{h.marge}</td>
                <td style={tdStyle}>{h.prix_final}</td>
                <td style={tdStyle}>{h.prix_arrondi}</td>
                <td style={tdStyle}>{h.description}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(h.id)} style={{ color: theme.error, fontWeight: "bold", border: "none", background: "none", fontSize: 18, cursor: "pointer" }} title="Supprimer">✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PrintCalcHistory;
