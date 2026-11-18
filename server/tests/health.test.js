import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/salud', () => {
  it('responde con estado 200 y confirma que el servidor está activo', async () => {
    const response = await request(app).get('/api/salud');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ estado: 'ok' });
  });
});
