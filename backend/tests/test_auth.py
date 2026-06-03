import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _login() -> dict:
    response = client.post(
        "/auth/login",
        json={"username": "admin", "password": "admin123"},
    )
    assert response.status_code == 200
    return response.json()


class TestHealth:
    def test_health_returns_ok(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestLogin:
    def test_login_success(self):
        data = _login()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] == 300

    def test_login_wrong_password(self):
        response = client.post(
            "/auth/login",
            json={"username": "admin", "password": "wrongpassword"},
        )
        assert response.status_code == 401
        assert "Invalid" in response.json()["detail"]

    def test_login_unknown_user(self):
        response = client.post(
            "/auth/login",
            json={"username": "unknown", "password": "admin123"},
        )
        assert response.status_code == 401

    def test_login_missing_fields(self):
        response = client.post("/auth/login", json={"username": "admin"})
        assert response.status_code == 422


class TestRefresh:
    def test_refresh_success(self):
        tokens = _login()
        response = client.post(
            "/auth/refresh",
            json={"refresh_token": tokens["refresh_token"]},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["expires_in"] == 300

    def test_refresh_with_access_token_fails(self):
        tokens = _login()
        response = client.post(
            "/auth/refresh",
            json={"refresh_token": tokens["access_token"]},
        )
        assert response.status_code == 401

    def test_refresh_with_invalid_token_fails(self):
        response = client.post(
            "/auth/refresh",
            json={"refresh_token": "not.a.valid.token"},
        )
        assert response.status_code == 401
