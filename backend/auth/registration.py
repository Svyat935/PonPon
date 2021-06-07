from auth.query.user import User as UserRequest
from bcrypt import hashpw, gensalt
from database.models.user import User as UserModel
from psycopg2._psycopg import DatabaseError
from starlette.responses import JSONResponse

PASSWORD_SALT = gensalt()


async def registration(user_request: UserRequest) -> bool:
    try:
        user_request.password = hashpw(
            user_request.password.encode(), PASSWORD_SALT
        ).decode()
        user_model = UserModel(**user_request.dict())
        await user_model.create()
    except DatabaseError:
        return False
    return True
