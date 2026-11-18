import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login.jsx';
import Registro from '../src/pages/Registro.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('pantallas de autenticación', () => {
  it('muestra el error enviado por el inicio de sesión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Correo o contraseña incorrectos' }),
    }));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Correo'), 'ana@negocio.com');
    await user.type(screen.getByLabelText('Contraseña'), 'segura123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByText('Correo o contraseña incorrectos'),
    ).toBeInTheDocument();
  });

  it('muestra el error de correo duplicado en el registro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Este correo ya está registrado' }),
    }));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Nombre'), 'Ana López');
    await user.type(screen.getByLabelText('Correo'), 'ana@negocio.com');
    await user.type(screen.getByLabelText('Contraseña'), 'segura123');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByText('Este correo ya está registrado'),
    ).toBeInTheDocument();
  });
});
