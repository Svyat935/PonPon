from database.connect import Base, create_session
from sqlalchemy import Column, Integer


class UserScript(Base):
    __tablename__ = "users_scripts"

    id = Column(Integer, primary_key=True)
    id_script = Column(Integer, primary_key=True)

    def __repr__(self):
        return f"<User_Script(id:{self.id}, id_script:{self.name})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
