import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import { autenticar } from '../middleware/auth.middleware.js';
import { crearNegocio } from '../models/negocio.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const negociosPath = path.join(__dirname, '..', '..', 'data', 'negocios.json');

async function leerNegocios() {
  const contenido = await fs.readFile(negociosPath, 'utf8');
  return JSON.parse(contenido);
}

async function guardarNegocios(negocios) {
  await fs.writeFile(negociosPath, JSON.stringify(negocios, null, 2), 'utf8');
}

router.use(autenticar);

router.post('/', async (req, res) => {
  try {
    const negocio = crearNegocio({
      ...req.body,
      propietarioId: req.usuarioId,
    });
    const negocios = await leerNegocios();
    negocios.push(negocio);
    await guardarNegocios(negocios);
    return res.status(201).json(negocio);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req, res) => {
  const negocios = await leerNegocios();
  return res.status(200).json(
    negocios.filter((negocio) => negocio.propietarioId === _req.usuarioId),
  );
});

router.put('/:id', async (req, res) => {
  const negocios = await leerNegocios();
  const indice = negocios.findIndex((negocio) => negocio.id === req.params.id);

  if (indice === -1) {
    return res.status(404).json({ error: 'Negocio no encontrado' });
  }
  if (negocios[indice].propietarioId !== req.usuarioId) {
    return res.status(403).json({ error: 'No puedes modificar este negocio' });
  }

  try {
    const editado = crearNegocio({
      ...negocios[indice],
      ...req.body,
      id: negocios[indice].id,
      propietarioId: req.usuarioId,
    });
    negocios[indice] = editado;
    await guardarNegocios(negocios);
    return res.status(200).json(editado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
