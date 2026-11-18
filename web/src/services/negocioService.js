import { solicitarJson } from './apiClient.js';

export async function consultarNegocios() {
  return solicitarJson('/api/negocios');
}

export async function crearNegocio(datos) {
  return solicitarJson('/api/negocios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function editarNegocio(id, datos) {
  return solicitarJson(`/api/negocios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}
