from database.connect import engine, Base
from fastapi import FastAPI
from database.models import User, User_Script, Script

TABLE_TO_CREATE = (
    Base.metadata.tables["users"],
    Base.metadata.tables["users_scripts"],
    Base.metadata.tables["scripts"],
)

Base.metadata.create_all(bind=engine, tables=TABLE_TO_CREATE)

app = FastAPI()


@app.post("/reg/")
def registration():
    return {"message": "Hello Post!"}


@app.post("/auth/")
def authentication():
    return {"message": "Hellow Post"}
