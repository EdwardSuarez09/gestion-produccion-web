import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearNegocio } from '../src/models/negocio.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const negociosPath = path.join(__dirname, '..', 'data', 'negocios.json');
let negociosOriginales;

beforeAll(async () => {
  negociosOriginales = await fs.readFile(negociosPath, 'utf8');
});

afterAll(async () => {
  await fs.writeFile(negociosPath, negociosOriginales, 'utf8');
});

async function limpiarNegocios() {
  await fs.writeFile(negociosPath, '[]', 'utf8');
}

function tokenUsuario(id = 'usuario-1') {
  return jwt.sign(
    { sub: id, email: `${id}@negocio.com` },
    process.env.JWT_SECRET || 'desarrollo-local-cambiar',
  );
}

describe('modelo Negocio', () => {
  it('crea un negocio con los campos compartidos y propietario', () => {
    const negocio = crearNegocio({
      nombre: 'Panadería Central',
      tipo: 'Panadería',
      ciudad: 'Bogotá',
      moneda: 'COP',
      propietarioId: 'usuario-1',
    });

    expect(negocio).toEqual({
      id: expect.any(String),
      nombre: 'Panadería Central',
      tipo: 'Panadería',
      ciudad: 'Bogotá',
      moneda: 'COP',
      propietarioId: 'usuario-1',
    });
  });

  describe('API /api/negocios', () => {
    it('crea y consulta el negocio del propietario autenticado', async () => {
      await limpiarNegocios();
      const token = tokenUsuario();
      const creado = await request(app)
        .post('/api/negocios')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Panadería Central',
          tipo: 'Panadería',
          ciudad: 'Bogotá',
          moneda: 'COP',
        });

      expect(creado.status).toBe(201);
      expect(creado.body.propietarioId).toBe('usuario-1');

      const consultado = await request(app)
        .get('/api/negocios')
        .set('Authorization', `Bearer ${token}`);

      expect(consultado.status).toBe(200);
      expect(consultado.body).toHaveLength(1);
    });

    it('impide que otro usuario consulte o edite el negocio', async () => {
      await limpiarNegocios();
      const tokenPropietario = tokenUsuario('usuario-1');
      const creado = await request(app)
        .post('/api/negocios')
        .set('Authorization', `Bearer ${tokenPropietario}`)
        .send({
          nombre: 'Panadería Central',
          tipo: 'Panadería',
          ciudad: 'Bogotá',
          moneda: 'COP',
        });

      const tokenAjeno = tokenUsuario('usuario-2');
      const consultado = await request(app)
        .get('/api/negocios')
        .set('Authorization', `Bearer ${tokenAjeno}`);
      const editado = await request(app)
        .put(`/api/negocios/${creado.body.id}`)
        .set('Authorization', `Bearer ${tokenAjeno}`)
        .send({ nombre: 'Otro nombre' });

      expect(consultado.body).toHaveLength(0);
      expect(editado.status).toBe(403);
    });
  });

  it('exige nombre y propietario al crear el modelo', () => {
    expect(() => crearNegocio({
      nombre: '',
      propietarioId: 'usuario-1',
    })).toThrow('El nombre del negocio es obligatorio');

    expect(() => crearNegocio({
      nombre: 'Panadería Central',
      propietarioId: '',
    })).toThrow('El propietario del negocio es obligatorio');
  });
});
