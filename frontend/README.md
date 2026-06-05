# Frontend

Aplicación web en React para autenticación contra el backend FastAPI.

## Funcionalidad

- Pantalla de **login** que consume `POST /token`.
- Guarda el `access_token` en `sessionStorage`.
- Pantalla de **bienvenida** protegida (`/welcome`).
- Si no hay sesión activa, no permite entrar a `/welcome`.
- Estilos alineados con `DESIGN.md` (paleta, tipografía y radios principales).

## Requisitos

- Node.js 20+ (se probó con Node 24).
- Backend en ejecución (por defecto en `http://localhost:8000`).

## Configuración

Opcionalmente, puedes configurar la URL del backend:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Uso

```bash
cd frontend
npm install
npm run dev
```

Abrir <http://localhost:5173>.

Credenciales del backend:

- Usuario: `admin`
- Contraseña: `admin123`

## Scripts

- `npm run dev` inicia el servidor de desarrollo.
- `npm run build` genera el build de producción.
- `npm run lint` ejecuta ESLint.
