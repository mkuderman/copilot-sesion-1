import os

SECRET_KEY = os.getenv("SECRET_KEY", "changeme-super-secret-key-for-dev-only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300
REFRESH_TOKEN_EXPIRE_SECONDS = 86400  # 24 hours
