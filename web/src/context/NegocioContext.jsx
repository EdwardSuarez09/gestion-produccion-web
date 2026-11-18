import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NegocioContext = createContext(null);

export function NegocioProvider({ children }) {
  const [negocioId, establecerNegocioId] = useState(
    localStorage.getItem('negocioId'),
  );

  const seleccionarNegocio = useCallback((id) => {
    if (id) {
      localStorage.setItem('negocioId', id);
    } else {
      localStorage.removeItem('negocioId');
    }
    establecerNegocioId(id);
  }, []);

  const value = useMemo(
    () => ({ negocioId, seleccionarNegocio }),
    [negocioId, seleccionarNegocio],
  );

  return (
    <NegocioContext.Provider value={value}>
      {children}
    </NegocioContext.Provider>
  );
}

export function useNegocio() {
  const contexto = useContext(NegocioContext);
  if (!contexto) {
    throw new Error('useNegocio debe usarse dentro de NegocioProvider');
  }
  return contexto;
}