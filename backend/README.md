# Backend – JWT Authentication API

API REST construida con **FastAPI** que implementa autenticación mediante **JSON Web Tokens (JWT)**.
Las contraseñas se almacenan usando **passlib[bcrypt]** y la gestión de dependencias se realiza con **Poetry**.

---

## Características

| Característica | Detalle |
|---|---|
| Framework | FastAPI |
| Autenticación | JWT (HS256) |
| Hashing | passlib + bcrypt 3.x |
| Gestor de dependencias | Poetry |
| Expiración del access token | 300 segundos |
| Expiración del refresh token | 86 400 segundos (24 h) |

---

## Endpoints

### `POST /token` – Iniciar sesión

Recibe credenciales y devuelve un `access_token` y un `refresh_token`.

**Cuerpo de la solicitud (JSON):**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**

```json
{
  "access_token": "<JWT>",
  "refresh_token": "<JWT>",
  "token_type": "bearer",
  "expires_in": 300
}
```

---

### `POST /token/refresh` – Refrescar el token de acceso

Intercambia un `refresh_token` válido por un nuevo `access_token`.

**Cuerpo de la solicitud (JSON):**

```json
{
  "refresh_token": "<refresh JWT>"
}
```

**Respuesta exitosa (200):**

```json
{
  "access_token": "<nuevo JWT>",
  "token_type": "bearer",
  "expires_in": 300
}
```

---

## Estructura del proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py        # Lógica de JWT y hashing de contraseñas
│   ├── config.py      # Variables de configuración
│   ├── main.py        # Aplicación FastAPI y rutas
│   └── models.py      # Modelos Pydantic (request/response)
├── tests/
│   ├── __init__.py
│   └── test_auth.py   # Tests de integración
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml
└── README.md
```

---

## Instalación y ejecución local (con Poetry)

### Requisitos previos

- Python ≥ 3.11
- [Poetry](https://python-poetry.org/docs/#installation)

### Pasos

```bash
cd backend

# Instalar dependencias
poetry install

# Iniciar el servidor de desarrollo
poetry run uvicorn app.main:app --reload --port 8000
```

La API estará disponible en <http://localhost:8000>.  
La documentación interactiva (Swagger UI) se puede consultar en <http://localhost:8000/docs>.

---

## Ejecución con Docker

### Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)

### Pasos

```bash
cd backend

# Construir y arrancar el contenedor
docker compose up --build
```

La API estará disponible en <http://localhost:8000>.

Para detenerla:

```bash
docker compose down
```

> **Nota de seguridad:** La variable `SECRET_KEY` en `docker-compose.yml` contiene un valor de ejemplo.  
> En un entorno de producción cámbiala por una clave aleatoria larga y segura.

---

## Ejecución de los tests

```bash
cd backend
poetry run pytest -v
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `SECRET_KEY` | Clave secreta para firmar los JWT | `changeme-super-secret-key-for-dev-only` |
