import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../src/routes/RutaProtegida.jsx';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('RutaProtegida', () => {
  it('redirige al login cuando no existe una sesión', () => {
    render(
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route
            element={
              <RutaProtegida>
                <h1>Contenido privado</h1>
              </RutaProtegida>
            }
            path="/panel"
          />
          <Route element={<h1>Iniciar sesión</h1>} path="/login" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('muestra el contenido protegido cuando hay sesión', () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'u1' } }),
    );

    render(
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route
            element={
              <RutaProtegida>
                <h1>Contenido privado</h1>
              </RutaProtegida>
            }
            path="/panel"
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Contenido privado' })).toBeInTheDocument();
  });
});
