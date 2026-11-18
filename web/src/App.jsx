import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import RutaProtegida from './routes/RutaProtegida.jsx';
import { cerrarSesion, obtenerSesion } from './services/authService.js';
import Negocio from './pages/Negocio.jsx';
import { NegocioProvider } from './context/NegocioContext.jsx';
import Historial from './pages/Historial.jsx';

function Inicio() {
  return (
    <section className="welcome-card">
      <p className="eyebrow">Plataforma de gestión</p>
      <h1>Gestión de producción gastronómica</h1>
      <p className="welcome-copy">
        Organiza la operación de tu negocio desde un solo lugar.
      </p>
      <Link className="primary-link" to="/panel">
        Ir al panel
      </Link>
    </section>
  );
}

function Panel() {
  return (
    <section className="welcome-card">
      <p className="eyebrow">Resumen</p>
      <h1>Panel general</h1>
      <p className="welcome-copy">
        Aquí podrás consultar la información de tu negocio.
      </p>
    </section>
  );
}

function NoEncontrada() {
  return (
    <section className="welcome-card">
      <h1>Página no encontrada</h1>
      <Link className="primary-link" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

export default function App() {
  const navegar = useNavigate();
  useLocation();
  const sesion = obtenerSesion();

  function cerrar() {
    cerrarSesion();
    navegar('/login');
  }

  return (
    <NegocioProvider>
      <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" end>
          <span aria-hidden="true" className="brand-mark">
            GP
          </span>
          <span>Gestión de producción</span>
        </NavLink>
        <nav aria-label="Navegación principal" className="main-nav">
          <NavLink end to="/">
            Inicio
          </NavLink>
          <NavLink to="/panel">Panel</NavLink>
          {!sesion ? (
            <>
              <NavLink to="/login">Iniciar sesión</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/negocio">Negocio</NavLink>
              <NavLink to="/historial">Historial</NavLink>
              <button className="nav-button" type="button" onClick={cerrar}>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route element={<Inicio />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Registro />} path="/registro" />
          <Route
            element={
              <RutaProtegida>
                <Panel />
              </RutaProtegida>
            }
            path="/panel"
          />
          <Route
            element={
              <RutaProtegida>
                <Negocio />
              </RutaProtegida>
            }
            path="/negocio"
          />
          <Route
            element={
              <RutaProtegida>
                <Historial />
              </RutaProtegida>
            }
            path="/historial"
          />
          <Route element={<Navigate replace to="/" />} path="/inicio" />
          <Route element={<NoEncontrada />} path="*" />
        </Routes>
      </main>
      <footer className="site-footer">
        Proyecto académico · Gestión de producción gastronómica
      </footer>
      </div>
    </NegocioProvider>
  );
}
