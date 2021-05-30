from database.connect import Base, create_session
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class EmailBehavior(Base):
    __tablename__ = "email_behavior"

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    id_script = Column(Integer, ForeignKey('email_scripts.id'), primary_key=True)
    child = relationship('EmailScripts', back_populates='parents')
    parent = relationship('User', back_populates='children')

    def __repr__(self):
        return f"<EmailBehavior(id:{self.id}, id_script:{self.name})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
