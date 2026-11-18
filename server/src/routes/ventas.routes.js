import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import { autenticar } from '../middleware/auth.middleware.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ventasPath = path.join(__dirname, '..', '..', 'data', 'ventas.json');

router.use(autenticar);

router.get('/', async (req, res) => {
  const contenido = await fs.readFile(ventasPath, 'utf8');
  const ventas = JSON.parse(contenido);
  const propias = ventas.filter(
    (venta) => !venta.propietarioId || venta.propietarioId === req.usuarioId,
  );
  return res.status(200).json(propias);
});

export default router;