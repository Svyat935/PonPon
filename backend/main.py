import uvicorn
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from auth.auth import authentication, parse_jwt
from auth.registration import registration
from auth.query.user import User as UserRequest
from auth.query.user_credentials import UserCredentials
from auth.query.user_tiny import UserTiny
from database.connect import engine, Base
from fastapi import FastAPI
from database.models.user import User
from database.models.telegram_scripts import TelegramScript
from database.models.settings import Settings
from database.models.telegram_behavior import TelegramBehavior
from telegram_scripts.bots import (
    update_bot,
    launch_bot,
    get_token_bot,
    disconnect_bot,
    update_token,
)
from telegram_scripts.query.form_update_scripts import (
    FormUpdateScripts,
    FormUpdateTelegramToken,
)
from telegram_scripts.scripts import update_scripts

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

bots = []


@app.get("/hello")
async def hello_world():
    return "Hello World!"


@app.post("/auth/registration/")
async def registration_root(user: UserRequest):
    status = await registration(user)
    if status:
        return JSONResponse(status_code=200)
    return JSONResponse(status_code=500)


@app.post("/auth/authorization")
def authentication_root(user: UserCredentials):
    token = authentication(user)
    if token:
        return JSONResponse(content={"token": token}, status_code=200)
    return JSONResponse(status_code=401)


@app.post("/jwt/decode")
async def decode_jwt(user: UserTiny):
    payload = parse_jwt(user.token)
    if payload:
        return JSONResponse(status_code=200, content={"payload": payload})
    return JSONResponse(status_code=401)


@app.post("/settings/change_telegram_token")
async def change_token(user: FormUpdateTelegramToken):
    payload = parse_jwt(user.token)
    if payload:
        user_id = payload.get("user_id")
        if await update_token(user_id, user.telegram_token):
            return JSONResponse(status_code=200)
    return JSONResponse(status_code=401)


@app.post("/scripts/update")
async def update_scenario(scripts: FormUpdateScripts):
    status = await update_scripts(scripts)
    if status:
        return JSONResponse(status_code=200)
    return JSONResponse(status_code=500)


@app.post("/scripts/update_bots")
def change_bot(user: UserTiny):
    payload = parse_jwt(user.token)
    if payload:
        user_id = payload.get("user_id")
        update_bot(user_id, bots)
    return JSONResponse(status_code=200)


@app.post("/bots/start")
def start_bot(user: UserTiny):
    payload = parse_jwt(user.token)
    if payload:
        user_id = payload.get("user_id")
        token = get_token_bot(user_id)
        launch_bot(token, bots)
    return JSONResponse(status_code=200)


@app.post("/bots/stop")
def stop_bot(user: UserTiny):
    payload = parse_jwt(user.token)
    if payload:
        user_id = payload.get("user_id")
        token = get_token_bot(user_id)
        disconnect_bot(token, bots)
    return JSONResponse(status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
