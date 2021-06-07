#!/usr/bin/env python
# pylint: disable=C0116
# This program is dedicated to the public domain under the CC0 license.

"""
Simple Bot to reply to Telegram messages.
First, a few handler functions are defined. Then, those functions are passed to
the Dispatcher and registered at their respective places.
Then, the bot is started and runs until we press Ctrl-C on the command line.
Usage:
Basic Echobot example, repeats messages.
Press Ctrl-C on the command line or send a signal to the process to stop the
bot.
"""

import logging

from telegram import Update, ForceReply, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import (
    Updater,
    CommandHandler,
    MessageHandler,
    Filters,
    CallbackContext, CallbackQueryHandler,
)

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)

logger = logging.getLogger(__name__)


# Define a few command handlers. These usually take the two arguments update and
# context.
def start(update: Update, _: CallbackContext) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr"Hi {user.mention_markdown_v2()}\!",
        reply_markup=ForceReply(selective=True),
    )


def help_command(update: Update, _: CallbackContext) -> None:
    """Send a message when the command /help is issued."""
    _.bot.send_message(update.message.from_user.id, "Help!",
                       reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("lol", callback_data=r"/help")]]))


def echo(update: Update, _: CallbackContext) -> None:
    """Echo the user message."""
    update.message.reply_text(update.message.text)


def button(update: Update, _: CallbackContext):
    query = update.callback_query

    # query.edit_message_text(text="Selected option: {}".format(query.data))

    print(query)

    _.bot.send_message(query.message.chat_id, str(query.data))


def main() -> None:
    """Start the bot."""
    # Create the Updater and pass it your bot's token.
    updater = Updater("1700299757:AAFyyfAmjfgJ9deTTQIDWTWP0rxa250oDrM")
    # updater1 = Updater("1793492942:AAHG8wQ7SWaPt9MTPCqSEUr8gosed6kq3zI")

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher
    # dispatcher1 = updater1.dispatcher

    # on different commands - answer in Telegram
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("help", help_command))
    dispatcher.add_handler(CallbackQueryHandler(button))

    # on non command i.e message - echo the message on Telegram
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))

    print(dispatcher.handlers)
    for handler in dispatcher.handlers[0]:
        dispatcher.remove_handler(handler)
    # Start the Bot
    updater.start_polling()
    # updater1.start_polling()
    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.


if __name__ == "__main__":
    main()
