import json
from typing import List, Optional

from sqlalchemy.exc import DatabaseError
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler

from database.connect import create_session
from database.models.settings import Settings
from database.models.telegram_behavior import TelegramBehavior
from database.models.telegram_scripts import TelegramScript
from telegram_scripts.scripts import get_user


async def update_token(user_id, token) -> bool:
    try:
        await Settings(user_id=user_id, telegram_token=token).create()
    except DatabaseError:
        return False
    return True


def get_token_bot(user_id) -> Optional[str]:
    with create_session() as db:
        settings = db.query(Settings).filter_by(user_id=user_id).first()
        if settings:
            return settings.telegram_token
    return None


def change_bot_updater(updater: Updater, scripts: List[TelegramScript]):
    dispatcher = updater.dispatcher
    for script in scripts:

        if script.buttons:
            buttons = []
            inline_button = []
            for button in json.loads(script.buttons).get("buttons"):
                inline_button.append(InlineKeyboardButton(button.get("text", ""), callback_data=button.get("link", "")))
                if len(inline_button) == 2:
                    buttons.append(inline_button)
                    inline_button = []
            if inline_button:
                buttons.append(inline_button)
            callback = (
                lambda text, keyboard: lambda update, _: update.message.reply_text(
                    text, reply_markup=keyboard
                )
            )
            command_handler = CommandHandler(f"{script.command}", callback(script.text, InlineKeyboardMarkup(buttons)))
        else:
            callback = lambda text: lambda update, _: update.message.reply_text(text)
            command_handler = CommandHandler(f"{script.command}", callback(script.text))

        dispatcher.add_handler(command_handler)


def update_bot(user_id: int, bots: List[Updater]):
    bot = None
    token = get_token_bot(user_id)
    for updater in bots:
        if updater.bot.token == token:
            bot = updater
    if bot:
        # Clear all handlers before add news
        if bot.dispatcher.handlers:
            handlers = bot.dispatcher.handlers[0]
            for handler in handlers:
                bot.dispatcher.remove_handler(handler)

        with create_session() as db:
            behaviours = db.query(TelegramBehavior).filter_by(user_id=user_id).all()
            scripts = []
            for behaviour in behaviours:
                scripts.append(
                    db.query(TelegramScript).filter_by(id=behaviour.script_id).first()
                )
            change_bot_updater(bot, scripts)


def launch_bot(token: str, bots: List[Updater]) -> None:
    for updater in bots:
        if updater.bot.token == token:
            updater.start_polling()
    else:
        bots.append(Updater(token))


def disconnect_bot(token: str, bots: List[Updater]) -> None:
    for updater in bots:
        if updater.bot.token == token:
            updater.stop()
