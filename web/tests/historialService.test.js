import { describe, expect, it } from 'vitest';
import {
  calcularTotales,
  filtrarVentas,
} from '../src/services/historialService.js';

const ventas = [
  {
    id: 'v1',
    fecha: '2026-11-10',
    productoId: 'p1',
    productoNombre: 'Pan',
    cantidad: 5,
    total: 25000,
  },
  {
    id: 'v2',
    fecha: '2026-11-12',
    productoId: 'p2',
    productoNombre: 'Pastel',
    cantidad: 2,
    total: 30000,
  },
  {
    id: 'v3',
    fecha: '2026-11-12',
    productoId: 'p1',
    productoNombre: 'Pan',
    cantidad: 3,
    total: 15000,
  },
];

describe('filtrarVentas', () => {
  it('ordena todas las ventas de la más reciente a la más antigua', () => {
    expect(filtrarVentas(ventas).map((venta) => venta.id)).toEqual([
      'v2',
      'v3',
      'v1',
    ]);
  });

  it('aplica rangos de fechas inclusivos', () => {
    expect(
      filtrarVentas(ventas, '2026-11-10', '2026-11-10').map(
        (venta) => venta.id,
      ),
    ).toEqual(['v1']);
  });

  it('filtra por producto', () => {
    expect(
      filtrarVentas(ventas, '', '', 'p1').map((venta) => venta.id),
    ).toEqual(['v3', 'v1']);
  });

  it('combina rango de fechas y producto', () => {
    expect(
      filtrarVentas(ventas, '2026-11-12', '2026-11-12', 'p1').map(
        (venta) => venta.id,
      ),
    ).toEqual(['v3']);
  });
});

describe('calcularTotales', () => {
  it('calcula unidades y dinero del resultado filtrado', () => {
    expect(calcularTotales([ventas[0], ventas[2]])).toEqual({
      unidades: 8,
      dinero: 40000,
    });
  });
});
