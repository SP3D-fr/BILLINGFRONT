// Fichier de configuration pour l’API backend
export const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchClients() {
  const response = await fetch(`${API_BASE_URL}/clients`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des clients');
  return await response.json();
}
