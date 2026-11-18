import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('flujo funcional HU-01', () => {
  it('CA-1: registra al usuario y permite entrar al panel', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'jwt-prueba',
        usuario: { id: 'u1', nombre: 'Ana', email: 'ana@negocio.com' },
      }),
    }));
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/registro']}>
        <App />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Nombre'), 'Ana López');
    await user.type(screen.getByLabelText('Correo'), 'ana@negocio.com');
    await user.type(screen.getByLabelText('Contraseña'), 'segura123');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByRole('heading', { name: 'Configurar negocio' }),
    ).toBeInTheDocument();
  });

  it('CA-3: inicia sesión y permite entrar al panel', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'jwt-prueba',
        usuario: { id: 'u1', nombre: 'Ana', email: 'ana@negocio.com' },
      }),
    }));
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Correo'), 'ana@negocio.com');
    await user.type(screen.getByLabelText('Contraseña'), 'segura123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByRole('heading', { name: 'Configurar negocio' }),
    ).toBeInTheDocument();
  });

  it('CA-5: una ruta protegida redirige al login sin sesión', () => {
    render(
      <MemoryRouter initialEntries={['/panel']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
  });
});
