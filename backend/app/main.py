from fastapi import FastAPI, HTTPException, status
from jose import JWTError

from app.auth import (
    ACCESS_TOKEN_EXPIRE_SECONDS,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models import LoginRequest, RefreshRequest, TokenResponse

app = FastAPI(title="JWT Authentication API", version="1.0.0")


@app.post("/auth/login", response_model=TokenResponse, summary="Login and obtain JWT tokens")
def login(request: LoginRequest):
    """
    Authenticate with username and password.

    - **username**: admin
    - **password**: admin123

    Returns an access token (expires in 300 seconds) and a refresh token.
    """
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(user["username"])
    refresh_token = create_refresh_token(user["username"])
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )


@app.post("/auth/refresh", response_model=TokenResponse, summary="Refresh access token")
def refresh(request: RefreshRequest):
    """
    Exchange a valid refresh token for a new access token and refresh token pair.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(request.refresh_token)
    except JWTError:
        raise credentials_exception

    if payload.get("type") != "refresh":
        raise credentials_exception

    username: str = payload.get("sub")
    if not username:
        raise credentials_exception

    access_token = create_access_token(username)
    new_refresh_token = create_refresh_token(username)
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )


@app.get("/health", summary="Health check")
def health():
    return {"status": "ok"}
