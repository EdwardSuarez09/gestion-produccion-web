import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService.js';
import { validarContrasena, validarEmail } from '../utils/validaciones.js';

export default function Login() {
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(event) {
    event.preventDefault();
    setError('');

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
      await iniciarSesion(email, password);
      navegar('/negocio', { replace: true });
    } catch (solicitudError) {
      setError(solicitudError.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Acceso</p>
      <h1>Iniciar sesión</h1>
      <form className="auth-form" onSubmit={enviar}>
        <label htmlFor="login-email">Correo</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
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
          {enviando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
      <p className="auth-link">
        ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
      </p>
    </section>
  );
}