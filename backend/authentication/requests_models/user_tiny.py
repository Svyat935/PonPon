from pydantic import BaseModel


class UserTiny(BaseModel):
    token: str
