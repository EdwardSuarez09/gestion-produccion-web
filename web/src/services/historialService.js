import { solicitarJson } from './apiClient.js';

export function filtrarVentas(
  ventas,
  fechaInicio = '',
  fechaFin = '',
  productoId = '',
) {
  const resultado = ventas.filter((venta) => {
    if (
      fechaInicio &&
      (venta.fecha || '').slice(0, 10) < fechaInicio
    ) {
      return false;
    }
    if (
      fechaFin &&
      (venta.fecha || '').slice(0, 10) > fechaFin
    ) {
      return false;
    }
    if (productoId && venta.productoId !== productoId) {
      return false;
    }
    return true;
  });

  return [...resultado].sort((a, b) =>
    String(b.fecha).localeCompare(String(a.fecha)),
  );
}

export function calcularTotales(ventas) {
  return ventas.reduce(
    (totales, venta) => ({
      unidades:
        totales.unidades +
        Number(venta.cantidad ?? venta.unidades ?? 0),
      dinero:
        totales.dinero +
        Number(venta.total ?? venta.dinero ?? 0),
    }),
    { unidades: 0, dinero: 0 },
  );
}

export async function consultarVentas() {
  return solicitarJson('/api/ventas');
}