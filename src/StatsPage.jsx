import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import authFetch from './authFetch';

export default function StatsPage() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authFetch('http://localhost:5000/api/statistiques')
      .then(res => res.json())
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{color: theme.text}}>Chargement des statistiques...</div>;
  if (error) return <div style={{ color: theme.error }}>Erreur : {error}</div>;
  if (!stats) return null;

  // Protection contre undefined/null dans les stats
  const totalCA = typeof stats.total_ca === 'number' ? stats.total_ca : 0;
  const nbFactures = typeof stats.nb_factures === 'number' ? stats.nb_factures : 0;
  const nbPayees = typeof stats.nb_payees === 'number' ? stats.nb_payees : 0;
  const nbImpayees = typeof stats.nb_impayees === 'number' ? stats.nb_impayees : 0;
  const topClients = Array.isArray(stats.top_clients) ? stats.top_clients : [];
  const evolutionMensuelle = Array.isArray(stats.evolution_mensuelle) ? stats.evolution_mensuelle : [];

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 700,
    margin: '40px auto',
    padding: 32
  };

  return (
    <div style={cardStyle}>
      <h2 style={{color: theme.text}}>Statistiques avancées</h2>
      <ul style={{ fontSize: 18, lineHeight: 2 }}>
        <li><b>Chiffre d'affaires total :</b> {totalCA.toFixed(2)} €</li>
        <li><b>Nombre de factures :</b> {nbFactures}</li>
        <li><b>Factures payées :</b> {nbPayees}</li>
        <li><b>Factures impayées :</b> {nbImpayees}</li>
      </ul>
      <h3 style={{color: theme.text}}>Top 3 clients</h3>
      <ol>
        {topClients.map((c, i) => (
          <li key={i}>{c.nom} — <b>{typeof c.ca === 'number' ? c.ca.toFixed(2) : '0.00'} €</b></li>
        ))}
      </ol>
      <h3 style={{color: theme.text}}>Évolution mensuelle du CA</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 8, margin: '24px 0' }}>
        {evolutionMensuelle.map((mois, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ background: '#ffa500', height: Math.max(10, typeof mois.ca === 'number' && totalCA > 0 ? mois.ca / (totalCA/2) * 100 : 10), borderRadius: 4, marginBottom: 4, transition: 'height 0.5s' }}></div>
            <span style={{ fontSize: 13 }}>{mois.mois}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
