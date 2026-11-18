import { useEffect, useMemo, useState } from 'react';
import {
  calcularTotales,
  consultarVentas,
  filtrarVentas,
} from '../services/historialService.js';

export default function Historial() {
  const [ventas, establecerVentas] = useState([]);
  const [fechaInicio, establecerFechaInicio] = useState('');
  const [fechaFin, establecerFechaFin] = useState('');
  const [productoId, establecerProductoId] = useState('');
  const [error, establecerError] = useState('');

  useEffect(() => {
    consultarVentas()
      .then(establecerVentas)
      .catch((solicitudError) => establecerError(solicitudError.message));
  }, []);

  const productos = useMemo(
    () => Array.from(
      new Map(
        ventas.map((venta) => [
          venta.productoId,
          venta.productoNombre || venta.productoId,
        ]),
      ),
      ([id, nombre]) => ({ id, nombre }),
    ),
    [ventas],
  );

  const resultado = filtrarVentas(
    ventas,
    fechaInicio,
    fechaFin,
    productoId,
  );
  const totales = calcularTotales(resultado);

  return (
    <section className="history-card">
      <p className="eyebrow">Ventas</p>
      <h1>Historial de ventas</h1>

      <div className="history-filters">
        <label htmlFor="fecha-inicio">Fecha inicio</label>
        <input
          id="fecha-inicio"
          type="date"
          value={fechaInicio}
          onChange={(event) => establecerFechaInicio(event.target.value)}
        />

        <label htmlFor="fecha-fin">Fecha fin</label>
        <input
          id="fecha-fin"
          type="date"
          value={fechaFin}
          onChange={(event) => establecerFechaFin(event.target.value)}
        />

        <label htmlFor="producto">Producto</label>
        <select
          id="producto"
          value={productoId}
          onChange={(event) => establecerProductoId(event.target.value)}
        >
          <option value="">Todos los productos</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {resultado.length === 0 ? (
        <p className="empty-state">
          No hay ventas para los filtros seleccionados
        </p>
      ) : (
        <>
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Unidades</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {resultado.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.fecha}</td>
                    <td>{venta.productoNombre || venta.productoId}</td>
                    <td>{venta.cantidad ?? venta.unidades ?? 0}</td>
                    <td>
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        maximumFractionDigits: 0,
                      }).format(venta.total ?? venta.dinero ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="history-totals">
            <p>
              <strong>Unidades:</strong> {totales.unidades}
            </p>
            <p>
              <strong>Total:</strong>{' '}
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
              }).format(totales.dinero)}
            </p>
          </div>
        </>
      )}
    </section>
  );
}