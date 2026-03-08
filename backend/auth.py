from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "mysecret123"
ALGORITHM = "HS256"
EXPIRE_HOURS = 10


# ---------------- CREATE TOKEN ----------------
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ---------------- VERIFY TOKEN ----------------
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # must contain user
        username = payload.get("user")
        if username is None:
            return None

        return payload

    except JWTError:
        return None
