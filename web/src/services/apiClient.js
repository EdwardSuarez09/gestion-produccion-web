const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function postJson(ruta, cuerpo) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No fue posible completar la solicitud');
  }

  return datos;
}

export async function solicitarJson(ruta, opciones = {}) {
  const sesion = JSON.parse(localStorage.getItem('sesion') || 'null');
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(sesion?.token
        ? { Authorization: `Bearer ${sesion.token}` }
        : {}),
      ...opciones.headers,
    },
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No fue posible completar la solicitud');
  }
  return datos;
}