from authentication.auth import authentication
from authentication.registration import registration
from authentication.requests_models.user import User as UserRequest
from authentication.requests_models.user_credentials import UserCredentials
from database.connect import engine, Base
from fastapi import FastAPI
from database.models.user import User as UserModel
from database.models.email_behavior import EmailBehavior
from database.models.email_scripts import EmailScripts
from database.models.email_scripts_relation import EmailScriptsRelation
from authentication.registration import UserModel

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/registration/")
async def registration_root(user: UserRequest):
    return await registration(user)


@app.post("/authentication/")
def authentication_root(user: UserCredentials):
    return authentication(user)
