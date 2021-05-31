from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relation


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    children = relation('EmailBehavior', back_populates='parent')
    settings = relation("Settings", back_populates='parent')

    def __repr__(self):
        return f"<User(id:{self.id}, name:{self.name}, email:{self.email}, password:{self.password})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
