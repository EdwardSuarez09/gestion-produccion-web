import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Historial from '../src/pages/Historial.jsx';
import { NegocioProvider } from '../src/context/NegocioContext.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('pantalla de historial', () => {
  it('muestra tabla, totales y permite el mensaje sin resultados', async () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'usuario-1' } }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        id: 'v1',
        fecha: '2026-11-10',
        productoId: 'p1',
        productoNombre: 'Pan',
        cantidad: 5,
        total: 25000,
      }],
    }));

    render(
      <MemoryRouter>
        <NegocioProvider>
          <Historial />
        </NegocioProvider>
      </MemoryRouter>,
    );

    expect((await screen.findAllByText('Pan')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('5')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/25\.000/)).length).toBeGreaterThan(0);
  });

  it('muestra el mensaje cuando no hay ventas', async () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'usuario-1' } }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));

    render(
      <MemoryRouter>
        <NegocioProvider>
          <Historial />
        </NegocioProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        'No hay ventas para los filtros seleccionados',
      ),
    ).toBeInTheDocument();
  });
});
