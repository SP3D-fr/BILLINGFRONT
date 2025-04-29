import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import authFetch from "./authFetch";

function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    email: "",
    telephone: "",
    adresse: "",
    iban: "",
    tarif_horaire_machine: "",
    prix_kg_filament: "",
    marge_defaut: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    authFetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        const newSettings = { ...settings };
        data.forEach((item) => {
          if (item.key in newSettings) newSettings[item.key] = item.value;
        });
        setSettings(newSettings);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setMessage("Erreur lors du chargement des paramètres");
        console.error("Erreur API settings:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    Promise.all(
      Object.entries(settings).map(([key, value]) =>
        authFetch(`/api/settings/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        })
      )
    ).then(() => setMessage("Paramètres enregistrés !"));
  };

  if (loading) return <div style={{color: theme.text}}>Chargement…</div>;

  const cardStyle = {
    flex: 1,
    background: theme.card,
    color: theme.text,
    padding: 24,
    borderRadius: 8,
    minWidth: 320,
    maxWidth: 400,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0'
  };

  return (
    <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 40 }}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={{color: theme.text}}>Paramètres de l'entreprise</h2>
        <label>Email :
          <input name="email" value={settings.email} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        <label>Téléphone :
          <input name="telephone" value={settings.telephone} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        <label>Adresse :
          <input name="adresse" value={settings.adresse} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        <label>IBAN :
          <input name="iban" value={settings.iban} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
      </form>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={{color: theme.text}}>Paramètres impression 3D</h2>
        <label>Tarif horaire machine (€ / h) :
          <input name="tarif_horaire_machine" type="number" step="0.01" value={settings.tarif_horaire_machine} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        <label>Prix du kg de filament (€) :
          <input name="prix_kg_filament" type="number" step="0.01" value={settings.prix_kg_filament} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        <label>Marge par défaut (%) :
          <input name="marge_defaut" type="number" step="0.01" value={settings.marge_defaut} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
        </label><br /><br />
        {message && <div style={{ color: message.startsWith('Erreur') ? theme.error : theme.success, marginBottom: 10 }}>{message}</div>}
        <button type="submit" style={{background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}`}}>Enregistrer</button>
      </form>
    </div>
  );
}

export default SettingsPage;
