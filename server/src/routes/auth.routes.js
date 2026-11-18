import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usuariosPath = path.join(__dirname, '..', '..', 'data', 'usuarios.json');
const jwtSecret = process.env.JWT_SECRET || 'desarrollo-local-cambiar';
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function leerUsuarios() {
  const contenido = await fs.readFile(usuariosPath, 'utf8');
  return JSON.parse(contenido);
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2), 'utf8');
}

function crearToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email },
    jwtSecret,
    { expiresIn: '8h' },
  );
}

function usuarioSeguro(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
}

router.post('/registro', async (req, res) => {
  const nombre = req.body.nombre?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!nombre || !patronEmail.test(email || '') || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Datos de registro inválidos' });
  }

  const usuarios = await leerUsuarios();
  if (usuarios.some((usuario) => usuario.email.toLowerCase() === email)) {
    return res.status(409).json({ error: 'Este correo ya está registrado' });
  }

  const usuario = {
    id: randomUUID(),
    nombre,
    email,
    password: await bcrypt.hash(password, 10),
  };
  usuarios.push(usuario);
  await guardarUsuarios(usuarios);

  return res.status(201).json({
    token: crearToken(usuario),
    usuario: usuarioSeguro(usuario),
  });
});

router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  const usuarios = await leerUsuarios();
  const usuario = usuarios.find((item) => item.email.toLowerCase() === email);
  const credencialesValidas =
    usuario &&
    typeof password === 'string' &&
    await bcrypt.compare(password, usuario.password);

  if (!credencialesValidas) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  return res.status(200).json({
    token: crearToken(usuario),
    usuario: usuarioSeguro(usuario),
  });
});

export default router;