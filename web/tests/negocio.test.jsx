import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Negocio from '../src/pages/Negocio.jsx';
import { NegocioProvider } from '../src/context/NegocioContext.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('configuración del negocio', () => {
  it('muestra error si el nombre está vacío', async () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'usuario-1' } }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NegocioProvider>
          <Negocio />
        </NegocioProvider>
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole('button', { name: 'Guardar negocio' }));

    expect(
      await screen.findByText('El nombre del negocio es obligatorio'),
    ).toBeInTheDocument();
  });

  it('muestra el negocio guardado en el perfil', async () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'usuario-1' } }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        id: 'negocio-1',
        nombre: 'Panadería Central',
        tipo: 'Panadería',
        ciudad: 'Bogotá',
        moneda: 'COP',
        propietarioId: 'usuario-1',
      }],
    }));

    render(
      <MemoryRouter>
        <NegocioProvider>
          <Negocio />
        </NegocioProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Panadería Central' }),
    ).toBeInTheDocument();
  });

  it('CA-4: edita el negocio y refleja el nuevo nombre', async () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'usuario-1' } }),
    );
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          id: 'negocio-1',
          nombre: 'Panadería Central',
          tipo: 'Panadería',
          ciudad: 'Bogotá',
          moneda: 'COP',
          propietarioId: 'usuario-1',
        }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'negocio-1',
          nombre: 'Panadería del Norte',
          tipo: 'Panadería',
          ciudad: 'Bogotá',
          moneda: 'COP',
          propietarioId: 'usuario-1',
        }),
      }));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NegocioProvider>
          <Negocio />
        </NegocioProvider>
      </MemoryRouter>,
    );

    const nombre = await screen.findByLabelText('Nombre');
    await user.clear(nombre);
    await user.type(nombre, 'Panadería del Norte');
    await user.click(screen.getByRole('button', { name: 'Guardar negocio' }));

    expect(
      await screen.findByRole('heading', { name: 'Panadería del Norte' }),
    ).toBeInTheDocument();
  });
});
