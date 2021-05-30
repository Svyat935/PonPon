from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, PickleType
from sqlalchemy.orm import relationship


class EmailScripts(Base):
    __tablename__ = "email_scripts"

    id = Column(Integer, primary_key=True)
    content = Column(String)
    action = Column(PickleType)
    variables = Column(PickleType)
    parents = relationship('EmailBehavior', back_populates='child')

    def __repr__(self):
        return f"<EmailScripts(id:{self.id}, content:{self.content}, action:{self.action}, variables:{self.variables})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
