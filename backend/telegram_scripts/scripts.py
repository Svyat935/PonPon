import json
from typing import Optional, Union, List

from auth.auth import parse_jwt
from database.connect import create_session
from database.models.telegram_behavior import TelegramBehavior
from database.models.telegram_scripts import TelegramScript
from database.models.user import User
from telegram_scripts.query.form_update_scripts import FormUpdateScripts


def get_user(user_id: Optional[int]) -> Optional[User]:
    if user_id is not None:
        with create_session() as db:
            user = db.query(User).filter_by(id=user_id).first()
            return user
    return None


def delete_all_scripts(user_id: int) -> None:
    with create_session() as db:
        telegram_behaviors = db.query(TelegramBehavior).filter_by(user_id=user_id)
        behaviors = telegram_behaviors.all()
        telegram_behaviors.delete()
        for behavior in behaviors:
            db.query(TelegramScript).filter_by(id=behavior.script_id).delete()
        db.commit()


async def update_scripts(scripts: FormUpdateScripts) -> bool:
    payload = parse_jwt(scripts.token)
    if payload:
        user = get_user(payload.get("user_id"))
        if user:
            delete_all_scripts(user.id)
            for block in scripts.blocks:
                buttons = None
                if block.buttons:
                    buttons = {
                        "buttons": [
                            {"text": button.text, "link": button.link}
                            for button in block.buttons
                        ]
                    }
                    buttons = json.dumps(buttons)
                telegram_scripts = await TelegramScript(
                    text=block.text, command=block.command, buttons=buttons
                ).create()
                await TelegramBehavior(
                    user_id=user.id, script_id=telegram_scripts.id
                ).create()
            return True
    return False


def get_scripts(user_id: int) -> List[TelegramScript]:
    with create_session() as db:
        behaviours = db.query(TelegramBehavior).filter_by(user_id=user_id).all()
        scripts = []
        for behaviour in behaviours:
            scripts.append(
                db.query(TelegramScript).filter_by(id=behaviour.script_id).first()
            )
    return scripts
