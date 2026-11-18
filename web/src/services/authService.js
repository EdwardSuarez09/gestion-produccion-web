import { postJson } from './apiClient.js';

const SESION_KEY = 'sesion';

export function obtenerSesion() {
  const almacenada = localStorage.getItem(SESION_KEY);

  if (!almacenada) {
    return null;
  }

  try {
    return JSON.parse(almacenada);
  } catch {
    localStorage.removeItem(SESION_KEY);
    return null;
  }
}

function guardarSesion(datos) {
  localStorage.setItem(SESION_KEY, JSON.stringify(datos));
  return datos;
}

export async function registrarCuenta(nombre, email, password) {
  const datos = await postJson('/api/auth/registro', {
    nombre,
    email,
    password,
  });
  return guardarSesion(datos);
}

export async function iniciarSesion(email, password) {
  const datos = await postJson('/api/auth/login', { email, password });
  return guardarSesion(datos);
}

export function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
}