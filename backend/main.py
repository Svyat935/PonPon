from starlette.middleware.cors import CORSMiddleware

from authentication.auth import authentication, parse_jwt
from authentication.registration import registration
from authentication.requests_models.user import User as UserRequest
from authentication.requests_models.user_credentials import UserCredentials
from authentication.requests_models.user_tiny import UserTiny
from database.connect import engine, Base, create_session
from fastapi import FastAPI, Request
from starlette.responses import JSONResponse
from starlette.routing import BaseRoute
from database.models.user import User as UserModel
from database.models.email_behavior import EmailBehavior
from database.models.email_scripts import EmailScripts
from database.models.email_scripts_relation import EmailScriptsRelation
from database.models.settings import Settings
from authentication.registration import UserModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5000",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/hello")
async def hello_world():
    return "Hello World!"


@app.post("/auth/registration/")
async def registration_root(user: UserRequest):
    return await registration(user)


@app.post("/auth/authorization")
def authentication_root(user: UserCredentials):
    return authentication(user)


@app.post("/jwt/decode")
async def decode_jwt(user: UserTiny):
    return parse_jwt(user.token)
