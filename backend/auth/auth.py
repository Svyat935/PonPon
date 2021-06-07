from datetime import datetime, timedelta
from typing import Optional, Dict

import bcrypt
import jwt
from auth.query.user_credentials import UserCredentials
from database.connect import create_session
from database.models.user import User as UserModel
from starlette.responses import JSONResponse

JWT_EXPIRE_DAY = datetime.utcnow() + timedelta(days=30)
JWT_KEY = r"'Ej5V?'SFuE+wLY:]H6\y3`{sZLHruC@"


def authentication(user: UserCredentials) -> Optional[str]:
    with create_session() as session:
        user_found = (
            session.query(UserModel)
            .filter(
                (UserModel.email == user.credentials)
                | (UserModel.name == user.credentials)
            )
            .first()
        )
        if user_found and bcrypt.checkpw(
            user.password.encode(), user_found.password.encode()
        ):
            token = jwt.encode(
                {"user_id": user_found.id, "exp": JWT_EXPIRE_DAY},
                key=JWT_KEY,
                algorithm="HS256",
            )
            return token
    return None


def parse_jwt(token: str) -> Optional[Dict[str, str]]:
    try:
        payload = jwt.decode(token, JWT_KEY, algorithms="HS256")
    except jwt.exceptions.ExpiredSignatureError:
        return None
    except jwt.DecodeError:
        return None
    return payload
