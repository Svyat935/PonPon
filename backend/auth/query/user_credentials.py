from pydantic import BaseModel


class UserCredentials(BaseModel):
    credentials: str
    password: str
