from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, PickleType


class Script(Base):
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True)
    next_script = Column(Integer)
    content = Column(String)
    action = Column(PickleType)
    variables = Column(PickleType)

    def __repr__(self):
        return f"<User(id:{self.id}, next_script:{self.next_script}," \
               f"content:{self.content}, action:{self.action}, variables:{self.variables})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
