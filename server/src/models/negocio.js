import { randomUUID } from 'node:crypto';

export function crearNegocio(datos) {
  const nombre = datos.nombre?.trim();
  const propietarioId = datos.propietarioId?.trim();

  if (!nombre) {
    throw new Error('El nombre del negocio es obligatorio');
  }
  if (!propietarioId) {
    throw new Error('El propietario del negocio es obligatorio');
  }

  return {
    id: datos.id || randomUUID(),
    nombre,
    tipo: datos.tipo?.trim() || '',
    ciudad: datos.ciudad?.trim() || '',
    moneda: datos.moneda?.trim() || '',
    propietarioId,
  };
}
