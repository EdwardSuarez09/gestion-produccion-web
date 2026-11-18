import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'desarrollo-local-cambiar';

export function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autenticación requerida' });
  }

  try {
    const payload = jwt.verify(header.slice(7), jwtSecret);
    req.usuarioId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
}
