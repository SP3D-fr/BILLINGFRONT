// Utilitaire fetch avec ajout automatique du token JWT
export default function authFetch(url, options = {}) {
  const token = sessionStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    'Authorization': token ? 'Bearer ' + token : '',
  };
  return fetch(url, { ...options, headers });
}
