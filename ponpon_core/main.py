from database.connect import engine, Base
from fastapi import FastAPI
from database.models.user import User
from database.models.email_behavior import EmailBehavior
from database.models.email_scripts import EmailScripts
from database.models.email_scripts_relation import EmailScriptsRelation

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/reg/")
def registration():
    return {"message": "Hello Post!"}


@app.post("/auth/")
def authentication():
    return {"message": "Hellow Post"}
