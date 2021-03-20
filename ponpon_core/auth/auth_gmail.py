import os
import pickle
from pathlib import Path
from typing import Any
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
PATH_TO_USER_CREDENTIALS = Path(__file__).parent.parent.joinpath("users_credentials")


def get_credentials_users(user: str) -> Any:
    """Downloads users credentials.

    :param user: User name.
    :return: User credentials.
    """
    files = os.listdir(PATH_TO_USER_CREDENTIALS)
    for file in files:
        if os.path.basename(file) == f"{user}.pickle":
            with open(f"{PATH_TO_USER_CREDENTIALS}\{file}", "rb") as cred:
                return pickle.load(cred)


def check_users(user: str) -> bool:
    """Проверяет есть ли пользователь в папке пользователей.

    :param user: Имя пользователя.
    :return: Есть ли пользователь в user_credentials.
    """
    files = os.listdir(PATH_TO_USER_CREDENTIALS)
    for file in files:
        file = os.path.basename(file)
        if user == os.path.splitext(file)[0]:
            return True
    return False


def gmail_auth(user: str = None):
    """Authentications user with help gmail.

    :param user: User name.
    :return: Gmail handle.
    """
    if not check_users(user):
        flow = InstalledAppFlow.from_client_secrets_file(r"../../credentials.json", SCOPES)
        credentials = flow.run_local_server(port=8080)
        with open(fr"{PATH_TO_USER_CREDENTIALS}\{user}.pickle", "wb") as file:
            pickle.dump(credentials, file)
    else:
        credentials = get_credentials_users(user)

    service = build("gmail", "v1", credentials=credentials)
    return service
