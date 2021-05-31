from datetime import datetime, timedelta
import bcrypt
import jwt
from authentication.requests_models.user_credentials import UserCredentials
from database.connect import create_session
from database.models.user import User as UserModel
from starlette.responses import JSONResponse

JWT_EXPIRE_DAY = datetime.utcnow() + timedelta(days=3)
JWT_KEY = r"'Ej5V?'SFuE+wLY:]H6\y3`{sZLHruC@"


def authentication(user: UserCredentials):
    with create_session() as session:
        user_found = session.query(UserModel).filter(
            (UserModel.email == user.credentials) | (UserModel.name == user.credentials)).first()
        if user_found and bcrypt.checkpw(user.password.encode(), user_found.password.encode()):
            token = jwt.encode({"user_id": user_found.id, "exp": JWT_EXPIRE_DAY}, key=JWT_KEY, algorithm="HS256")
            return JSONResponse(content={"token": token}, status_code=200)
    return JSONResponse(status_code=401)


def parse_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_KEY, algorithms="HS256")
    except jwt.exceptions.ExpiredSignatureError:
        JSONResponse(status_code=401)
    except jwt.DecodeError:
        JSONResponse(status_code=401)
    return payload
