import re

from pydantic import BaseModel, validator
from database.models.user import User as UserModel

from database.connect import create_session


class User(BaseModel):
    name: str
    email: str
    password: str

    @validator('name')
    def validator_for_name(cls, variable):
        with create_session() as session:
            user_found = session.query(UserModel).filter(UserModel.name == variable).first()
            if user_found:
                raise ValueError("User exist!")
            return variable

    @validator("email")
    def validator_for_email(cls, variable):
        pattern = re.compile('(^|\s)[-a-z0-9_.]+@([-a-z0-9]+\.)+[a-z]{2,6}(\s|$)')
        is_valid = pattern.match(variable)
        if is_valid:
            with create_session() as session:
                user_found = session.query(UserModel).filter(UserModel.email == variable).first()
                if user_found:
                    raise ValueError("Email exist!")
                return variable
        else:
            raise ValueError("Email isn't valid!")

    @validator("password")
    def validator_for_password(cls, variable):
        if len(variable) < 6:
            raise ValueError("Password is too small!")
        return variable
