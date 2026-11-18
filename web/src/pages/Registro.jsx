import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarCuenta } from '../services/authService.js';
import { validarContrasena, validarEmail } from '../utils/validaciones.js';

export default function Registro() {
  const navegar = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(event) {
    event.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!validarEmail(email)) {
      setError('Ingresa un correo válido');
      return;
    }
    if (!validarContrasena(password)) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    setEnviando(true);
    try {
      await registrarCuenta(nombre, email, password);
      navegar('/negocio', { replace: true });
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Nueva cuenta</p>
      <h1>Registrarse</h1>
      <form className="auth-form" onSubmit={enviar}>
        <label htmlFor="registro-nombre">Nombre</label>
        <input
          id="registro-nombre"
          name="nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />

        <label htmlFor="registro-email">Correo</label>
        <input
          id="registro-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="registro-password">Contraseña</label>
        <input
          id="registro-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-button" disabled={enviando} type="submit">
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="auth-link">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </section>
  );
}