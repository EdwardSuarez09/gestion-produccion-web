import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('authService', () => {
  it('guarda y recupera la sesión iniciada', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'jwt-prueba',
        usuario: { id: 'u1', nombre: 'Ana', email: 'ana@negocio.com' },
      }),
    }));
    const { iniciarSesion, obtenerSesion } = await import(
      '../src/services/authService.js'
    );

    const resultado = await iniciarSesion('ana@negocio.com', 'segura123');

    expect(resultado.usuario.email).toBe('ana@negocio.com');
    expect(obtenerSesion()).toEqual({
      token: 'jwt-prueba',
      usuario: { id: 'u1', nombre: 'Ana', email: 'ana@negocio.com' },
    });
  });

  it('cierra la sesión eliminando los datos guardados', async () => {
    localStorage.setItem('sesion', JSON.stringify({ token: 'jwt-prueba' }));
    const { cerrarSesion, obtenerSesion } = await import(
      '../src/services/authService.js'
    );

    cerrarSesion();

    expect(obtenerSesion()).toBeNull();
  });
});
