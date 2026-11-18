# Gestión de producción gastronómica

Aplicación web académica para apoyar la gestión de producción en negocios gastronómicos. La base técnica usa React, Vite y React Router en el frontend, y Node.js con Express en el backend. Los datos se almacenan en archivos JSON dentro de `server/data/`.

## Requisitos

- Node.js 24 LTS
- npm
- Git

## Instalación

Desde la raíz del repositorio, instala las dependencias de cada proyecto:

```bash
npm ci
npm ci --prefix server
npm ci --prefix web
```

## Desarrollo

Levanta frontend y backend juntos desde la raíz:

```bash
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- Comprobación de salud: `GET http://localhost:3000/api/salud` devuelve `{ "estado": "ok" }`.

Detén ambos procesos con `Ctrl+C`.

## Pruebas y calidad

Ejecuta ESLint desde la raíz:

```bash
npm run lint
```

Ejecuta las pruebas por proyecto:

```bash
npm --prefix server test
npm --prefix web test
```

Construye el frontend para producción:

```bash
npm --prefix web run build
```

El workflow de GitHub Actions ejecuta lint, las pruebas de servidor y frontend y el build en cada `push` y `pull_request`.

## Estructura principal

```text
server/
  data/       Archivos JSON
  src/        Aplicación y punto de entrada Express
  tests/      Pruebas del backend
web/
  src/        Aplicación React, páginas, servicios y componentes
  tests/      Pruebas del frontend
.github/
  workflows/ci.yml
```

## Flujo de trabajo Git

- `main`: versión estable.
- `develop`: integración del sprint.
- `feature/<nombre>`: trabajo de una tarea; se crea desde `develop` y se integra mediante pull request a `develop`.

Usa mensajes de commit semánticos, por ejemplo `feat(web): agregar navegación principal` o `test(server): cubrir ruta de salud`.
