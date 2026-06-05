from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.config import ACCESS_TOKEN_EXPIRE_SECONDS
from app.models import LoginRequest, RefreshRequest, RefreshResponse, TokenResponse

app = FastAPI(
    title="JWT Authentication API",
    description="FastAPI backend with JWT authentication using passlib/bcrypt.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/token", response_model=TokenResponse, summary="Login and obtain JWT tokens")
def login(request: LoginRequest) -> TokenResponse:
    """Authenticate the user and return an access token and a refresh token.

    - **username**: must be `admin`
    - **password**: must be `admin123`
    - The access token expires in **300 seconds**.
    """
    if not authenticate_user(request.username, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(request.username),
        refresh_token=create_refresh_token(request.username),
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )


@app.post(
    "/token/refresh",
    response_model=RefreshResponse,
    summary="Refresh the access token",
)
def refresh_token(request: RefreshRequest) -> RefreshResponse:
    """Exchange a valid refresh token for a new access token."""
    username = decode_refresh_token(request.refresh_token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return RefreshResponse(
        access_token=create_access_token(username),
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )
