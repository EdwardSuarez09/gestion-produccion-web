import { useEffect, useState } from 'react';
import { useNegocio } from '../context/NegocioContext.jsx';
import {
  consultarNegocios,
  crearNegocio,
  editarNegocio,
} from '../services/negocioService.js';
import { validarNegocio } from '../utils/validaciones.js';

const vacio = { nombre: '', tipo: '', ciudad: '', moneda: '' };

export default function Negocio() {
  const [datos, establecerDatos] = useState(vacio);
  const [negocio, establecerNegocio] = useState(null);
  const [error, establecerError] = useState('');
  const [cargando, establecerCargando] = useState(true);
  const { seleccionarNegocio } = useNegocio();

  useEffect(() => {
    consultarNegocios()
      .then(([activo]) => {
        if (activo) {
          establecerNegocio(activo);
          establecerDatos({
            nombre: activo.nombre,
            tipo: activo.tipo,
            ciudad: activo.ciudad,
            moneda: activo.moneda,
          });
          seleccionarNegocio(activo.id);
        }
      })
      .catch((solicitudError) => establecerError(solicitudError.message))
      .finally(() => establecerCargando(false));
  }, [seleccionarNegocio]);

  async function guardar(event) {
    event.preventDefault();
    establecerError(validarNegocio(datos));
    if (validarNegocio(datos)) {
      return;
    }

    try {
      const guardado = negocio
        ? await editarNegocio(negocio.id, datos)
        : await crearNegocio(datos);
      establecerNegocio(guardado);
      establecerDatos({
        nombre: guardado.nombre,
        tipo: guardado.tipo,
        ciudad: guardado.ciudad,
        moneda: guardado.moneda,
      });
      seleccionarNegocio(guardado.id);
      establecerError('');
    } catch (solicitudError) {
      establecerError(solicitudError.message);
    }
  }

  if (cargando) {
    return <p>Cargando negocio...</p>;
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Mi negocio</p>
      {negocio ? (
        <h1>{negocio.nombre}</h1>
      ) : (
        <h1>Configurar negocio</h1>
      )}
      <form className="auth-form" onSubmit={guardar}>
        <label htmlFor="negocio-nombre">Nombre</label>
        <input
          id="negocio-nombre"
          value={datos.nombre}
          onChange={(event) =>
            establecerDatos({ ...datos, nombre: event.target.value })
          }
        />
        <label htmlFor="negocio-tipo">Tipo de negocio</label>
        <input
          id="negocio-tipo"
          value={datos.tipo}
          onChange={(event) =>
            establecerDatos({ ...datos, tipo: event.target.value })
          }
        />
        <label htmlFor="negocio-ciudad">Ciudad</label>
        <input
          id="negocio-ciudad"
          value={datos.ciudad}
          onChange={(event) =>
            establecerDatos({ ...datos, ciudad: event.target.value })
          }
        />
        <label htmlFor="negocio-moneda">Moneda</label>
        <input
          id="negocio-moneda"
          value={datos.moneda}
          onChange={(event) =>
            establecerDatos({ ...datos, moneda: event.target.value })
          }
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit">
          Guardar negocio
        </button>
      </form>
    </section>
  );
}