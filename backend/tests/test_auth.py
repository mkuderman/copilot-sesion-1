import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_login_success():
    response = client.post("/token", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 300


def test_login_wrong_password():
    response = client.post("/token", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 401


def test_login_unknown_user():
    response = client.post("/token", json={"username": "unknown", "password": "admin123"})
    assert response.status_code == 401


def test_refresh_token_success():
    # First obtain a refresh token
    login_response = client.post(
        "/token", json={"username": "admin", "password": "admin123"}
    )
    refresh_token = login_response.json()["refresh_token"]

    response = client.post("/token/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 300


def test_refresh_token_invalid():
    response = client.post("/token/refresh", json={"refresh_token": "invalid.token.here"})
    assert response.status_code == 401


def test_refresh_token_wrong_type():
    """An access token must not be accepted as a refresh token."""
    login_response = client.post(
        "/token", json={"username": "admin", "password": "admin123"}
    )
    access_token = login_response.json()["access_token"]

    response = client.post("/token/refresh", json={"refresh_token": access_token})
    assert response.status_code == 401


def test_login_cors_allowed_origin():
    response = client.post(
        "/token",
        json={"username": "admin", "password": "admin123"},
        headers={"Origin": "http://localhost:5173"},
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
