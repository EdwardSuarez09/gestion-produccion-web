import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import negocioRoutes from './routes/negocio.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/negocios', negocioRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/api/salud', (_req, res) => {
  res.status(200).json({ estado: 'ok' });
});

export default app;