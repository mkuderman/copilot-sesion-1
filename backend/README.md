# Backend — JWT Authentication API

A REST API built with **Python** and **FastAPI** that implements JWT (JSON Web Token) authentication.

## Features

- **Login endpoint** — authenticates with username/password and returns a signed JWT access token (valid for 300 seconds) plus a refresh token.
- **Refresh endpoint** — exchanges a valid refresh token for a new access/refresh token pair.
- **Password hashing** — passwords are hashed with `passlib[bcrypt]`.
- **Health check** endpoint.

## Credentials (demo)

| Field    | Value      |
|----------|------------|
| username | `admin`    |
| password | `admin123` |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- **OR** [Python 3.11+](https://www.python.org/) and [Poetry](https://python-poetry.org/docs/#installation)

---

## Running with Docker (recommended)

```bash
# From the backend/ directory
docker compose up --build
```

The API will be available at <http://localhost:8000>.

> **Production note:** set the `SECRET_KEY` environment variable to a strong random value before deploying:
> ```bash
> SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
> docker compose up --build -e SECRET_KEY=$SECRET_KEY
> ```

---

## Running locally with Poetry

```bash
# 1. Install dependencies
poetry install

# 2. Start the development server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## API Endpoints

### `POST /auth/login`

Authenticate and obtain tokens.

**Request body (JSON):**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

---

### `POST /auth/refresh`

Obtain a new token pair from a valid refresh token.

**Request body (JSON):**

```json
{
  "refresh_token": "<refresh_jwt>"
}
```

**Response:** same schema as `/auth/login`.

---

### `GET /health`

Returns `{"status": "ok"}` — useful for container health checks.

---

## Interactive documentation

When the server is running, open <http://localhost:8000/docs> in your browser to explore the API via Swagger UI.

---

## Project structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py        # JWT and password utilities
│   ├── main.py        # FastAPI application & routes
│   └── models.py      # Pydantic request/response models
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml     # Poetry dependency file
└── README.md
```

---

## Running tests

```bash
poetry run pytest
```
