from database.connect import engine, Base
from fastapi import FastAPI

TABLE_TO_CREATE = (
    # Base.metadata.tables["users"]
)

Base.metadata.create_all(bind=engine, tables=TABLE_TO_CREATE)

app = FastAPI()


@app.get("/")
def test():
    return {"message": "Hello World"}
