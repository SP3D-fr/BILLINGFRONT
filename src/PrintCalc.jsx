import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import PrintCalcHistory from "./PrintCalcHistory";
import authFetch from "./authFetch";

function PrintCalc() {
  const theme = useTheme();
  const [form, setForm] = useState({ temps_impression: "", poids_filament: "", marge_specifique: "", nom_produit: "Impression 3D personnalisée" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Validation uniquement à la soumission
  const validate = (fields = form) => {
    const errs = {};
    if (!fields.nom_produit || fields.nom_produit.trim().length < 3) errs.nom_produit = "Nom trop court";
    if (!fields.temps_impression || isNaN(fields.temps_impression) || Number(fields.temps_impression) <= 0) errs.temps_impression = "Durée invalide (>0)";
    if (!fields.poids_filament || isNaN(fields.poids_filament) || Number(fields.poids_filament) <= 0) errs.poids_filament = "Poids invalide (>0)";
    if (fields.marge_specifique && (isNaN(fields.marge_specifique) || Number(fields.marge_specifique) < 0)) errs.marge_specifique = "Marge invalide (>=0)";
    return errs;
  };
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setError("");
    setResult(null);
    setSaveMsg("");
    setLoading(true);
    authFetch("/api/calcul-impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temps_impression: form.temps_impression,
        poids_filament: form.poids_filament,
        marge_specifique: form.marge_specifique || undefined,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res || typeof res !== 'object' || Object.keys(res).length === 0 || res.cout_filament === undefined) {
          setError("Aucun résultat retourné par le serveur.");
          setResult(null);
        } else {
          setResult(res);
        }
      })
      .catch(() => setError("Erreur lors du calcul."))
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveMsg("");
    authFetch("/api/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: form.nom_produit,
        prix: result.prix_arrondi,
        description: `Calcul impression 3D : ${form.poids_filament}g, ${form.temps_impression}h, marge ${result.marge}%`
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaveMsg(`Produit créé : ${data.nom} (${data.prix} €)`);
        setSaving(false);
        authFetch("/api/calcul-historique", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom_produit: form.nom_produit,
            temps_impression: form.temps_impression,
            poids_filament: form.poids_filament,
            marge: result.marge,
            prix_final: result.prix_final,
            prix_arrondi: result.prix_arrondi,
            description: `Calcul impression 3D : ${form.poids_filament}g, ${form.temps_impression}h, marge ${result.marge}%`
          }),
        });
      })
      .catch(() => {
        setSaveMsg("Erreur lors de la création du produit.");
        setSaving(false);
      });
  };

  if (showHistory) return <PrintCalcHistory onBack={() => setShowHistory(false)} />;

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    padding: 24,
    borderRadius: 8,
    boxShadow: theme.mode === 'dark' ? '0 2px 12px #2228' : '0 2px 8px #ccc5',
    border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
    maxWidth: 500,
    margin: "40px auto"
  };

  return (
    <div style={cardStyle}>
      <h2 style={{color: theme.text}}>Calcul d'impression 3D</h2>
      <button onClick={() => setShowHistory(true)} style={{ float: "right", marginTop: -40, background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}` }}>Voir l'historique</button>
      <form onSubmit={handleSubmit} noValidate>
        <label>Nom du produit :
          <input name="nom_produit" value={form.nom_produit} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
          {errors.nom_produit && <span style={{ color: theme.error, fontSize: 13 }}>{errors.nom_produit}</span>}
        </label><br /><br />
        <label>Temps d'impression (heures) :
          <input type="number" step="0.01" name="temps_impression" value={form.temps_impression} onChange={handleChange} required style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
          {errors.temps_impression && <span style={{ color: theme.error, fontSize: 13 }}>{errors.temps_impression}</span>}
        </label><br /><br />
        <label>Poids filament (g) :
          <input type="number" step="0.01" name="poids_filament" value={form.poids_filament} onChange={handleChange} required style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
          {errors.poids_filament && <span style={{ color: theme.error, fontSize: 13 }}>{errors.poids_filament}</span>}
        </label><br /><br />
        <label>Marge spécifique (%) :
          <input type="number" step="0.01" name="marge_specifique" value={form.marge_specifique} onChange={handleChange} style={{ width: "100%", background: theme.input, color: theme.text, border: `1px solid ${theme.border}` }} />
          {errors.marge_specifique && <span style={{ color: theme.error, fontSize: 13 }}>{errors.marge_specifique}</span>}
        </label><br /><br />
        <button type="submit" style={{background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}`}} disabled={loading}>Calculer</button>
        {loading && <span style={{marginLeft: 16}}><svg width="24" height="24" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke={theme.text} strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" from="0 25 25" to="360 25 25"/></circle></svg></span>}
      </form>
      {error && <div style={{ color: theme.error, marginTop: 10 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{color: theme.text}}>Résultat :</h4>
          <ul>
            <li>Coût filament : {result.cout_filament} €</li>
            <li>Coût machine : {result.cout_machine} €</li>
            <li>Coût total (hors marge) : {result.cout_total} €</li>
            <li>Marge appliquée : {result.marge} %</li>
            <li><b>Prix final : {result.prix_final} €</b></li>
            <li><b>Prix arrondi : {result.prix_arrondi} €</b></li>
          </ul>
          <button onClick={handleSave} disabled={saving} style={{ marginTop: 10, background: theme.button, color: theme.buttonText, border: `1px solid ${theme.border}` }}>
            {saving ? "Enregistrement..." : "Enregistrer comme produit"}
          </button>
          {saveMsg && <div style={{ color: saveMsg.startsWith("Erreur") ? theme.error : theme.success, marginTop: 10 }}>{saveMsg}</div>}
        </div>
      )}
    </div>
  );
}

export default PrintCalc;
