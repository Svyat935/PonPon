from dataclasses import dataclass

from googleapiclient.discovery import Resource


@dataclass
class UserGmail:
    user_service: Resource
