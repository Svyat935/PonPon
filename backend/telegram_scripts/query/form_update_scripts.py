from typing import Optional, List

from pydantic import BaseModel


class Button(BaseModel):
    text: str
    link: Optional[str]


class BlockScript(BaseModel):
    command: str
    text: str
    buttons: Optional[List[Button]]


class FormUpdateScripts(BaseModel):
    token: str
    blocks: List[BlockScript]


class FormUpdateTelegramToken(BaseModel):
    token: str
    telegram_token: str
