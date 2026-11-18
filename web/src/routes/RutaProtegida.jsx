import { Navigate, useLocation } from 'react-router-dom';
import { obtenerSesion } from '../services/authService.js';

export default function RutaProtegida({ children }) {
  const sesion = obtenerSesion();
  const ubicacion = useLocation();

  if (!sesion?.token) {
    return <Navigate replace state={{ from: ubicacion.pathname }} to="/login" />;
  }

  return children;
}