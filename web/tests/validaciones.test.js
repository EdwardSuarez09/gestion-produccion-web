import { describe, expect, it } from 'vitest';
import {
  validarContrasena,
  validarEmail,
  validarNegocio,
} from '../src/utils/validaciones.js';

describe('validarEmail', () => {
  it.each([
    ['ana.lopez+ventas@negocio.com', true],
    ['', false],
    ['ana.negocio.com', false],
    ['ana@negocio', false],
    ['ana @negocio.com', false],
    [null, false],
  ])('valida %s como correo', (email, esperado) => {
    expect(validarEmail(email)).toBe(esperado);
  });
});

describe('validarContrasena', () => {
  it.each([
    ['12345678', true],
    ['1234567', false],
    ['', false],
    [null, false],
  ])('valida la longitud de %s', (contrasena, esperado) => {
    expect(validarContrasena(contrasena)).toBe(esperado);
  });
});

describe('validarNegocio', () => {
  it('exige el nombre del negocio', () => {
    expect(validarNegocio({
      nombre: '',
      tipo: 'Panadería',
      ciudad: 'Bogotá',
      moneda: 'COP',
    })).toBe('El nombre del negocio es obligatorio');
  });

  it('exige tipo, ciudad y moneda antes de guardar', () => {
    expect(validarNegocio({
      nombre: 'Panadería Central',
      tipo: '',
      ciudad: 'Bogotá',
      moneda: 'COP',
    })).toBe('Selecciona el tipo de negocio');
  });

  it('acepta un formulario completo', () => {
    expect(validarNegocio({
      nombre: 'Panadería Central',
      tipo: 'Panadería',
      ciudad: 'Bogotá',
      moneda: 'COP',
    })).toBe('');
  });
});
