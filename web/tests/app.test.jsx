import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';

describe('layout principal', () => {
  it('muestra el inicio y navega al panel', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'sesion',
      JSON.stringify({ token: 'jwt-prueba', usuario: { id: 'u1' } }),
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Gestión de producción gastronómica',
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Panel' }));

    expect(
      screen.getByRole('heading', { name: 'Panel general' }),
    ).toBeInTheDocument();
  });
});
