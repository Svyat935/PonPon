import bcrypt
from authentication.requests_models.user_credentials import UserCredentials
from database.connect import create_session
from database.models.user import User as UserModel
from starlette.responses import JSONResponse


def authentication(user: UserCredentials):
    with create_session() as session:
        user_found = session.query(UserModel).filter(
            (UserModel.email == user.credentials) | (UserModel.name == user.credentials)).first()
        if user_found and bcrypt.checkpw(user.password.encode(), user_found.password.encode()):
            return JSONResponse(status_code=200)
    return JSONResponse(status_code=401)
