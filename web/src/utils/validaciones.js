const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  return typeof email === 'string' && patronEmail.test(email.trim());
}

export function validarContrasena(contrasena) {
  return typeof contrasena === 'string' && contrasena.length >= 8;
}

export function validarNegocio(datos) {
  if (!datos.nombre?.trim()) {
    return 'El nombre del negocio es obligatorio';
  }
  if (!datos.tipo?.trim()) {
    return 'Selecciona el tipo de negocio';
  }
  if (!datos.ciudad?.trim()) {
    return 'Ingresa la ciudad';
  }
  if (!datos.moneda?.trim()) {
    return 'Selecciona la moneda';
  }
  return '';
}