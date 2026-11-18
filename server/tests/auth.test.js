import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usuariosPath = path.join(__dirname, '..', 'data', 'usuarios.json');
let usuariosOriginales;

beforeAll(async () => {
  usuariosOriginales = await fs.readFile(usuariosPath, 'utf8');
});

afterAll(async () => {
  await fs.writeFile(usuariosPath, usuariosOriginales, 'utf8');
});

async function limpiarUsuarios() {
  await fs.writeFile(usuariosPath, '[]', 'utf8');
}

describe('POST /api/auth/registro', () => {
  it('rechaza correo inválido y contraseña menor de 8 caracteres', async () => {
    await limpiarUsuarios();

    const correoInvalido = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio',
      password: 'segura123',
    });
    expect(correoInvalido.status).toBe(400);

    const contrasenaCorta = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: '1234567',
    });
    expect(contrasenaCorta.status).toBe(400);
  });

  it('registra un usuario válido con contraseña cifrada', async () => {
    await limpiarUsuarios();

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: 'segura123',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.usuario.email).toBe('ana@negocio.com');

    const usuarios = JSON.parse(await fs.readFile(usuariosPath, 'utf8'));
    expect(usuarios[0].password).not.toBe('segura123');
    expect(usuarios[0].password).toMatch(/^\$2[aby]\$/);
  });

  it('rechaza un correo ya registrado', async () => {
    await limpiarUsuarios();
    await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: 'segura123',
    });

    const response = await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: 'otraClave123',
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Este correo ya está registrado');
  });
});

describe('POST /api/auth/login', () => {
  it('rechaza credenciales de un usuario inexistente', async () => {
    await limpiarUsuarios();

    const response = await request(app).post('/api/auth/login').send({
      email: 'nadie@negocio.com',
      password: 'segura123',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Correo o contraseña incorrectos');
  });

  it('inicia sesión con credenciales correctas', async () => {
    await limpiarUsuarios();
    await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: 'segura123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'ana@negocio.com',
      password: 'segura123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('rechaza una contraseña incorrecta', async () => {
    await limpiarUsuarios();
    await request(app).post('/api/auth/registro').send({
      nombre: 'Ana López',
      email: 'ana@negocio.com',
      password: 'segura123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'ana@negocio.com',
      password: 'incorrecta',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Correo o contraseña incorrectos');
  });
});
