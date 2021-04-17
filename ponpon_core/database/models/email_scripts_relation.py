
from database.connect import Base, create_session
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class EmailScriptsRelation(Base):
    __tablename__ = "email_scripts_relation"

    id = Column(Integer, ForeignKey('email_scripts.id'), primary_key=True)
    next_id = Column(Integer, ForeignKey('email_scripts.id'), primary_key=True)
    parent = relationship("EmailScripts", back_populates='child_script')
    child = relationship("EmailScripts", back_populates='parent_script')

    def __repr__(self):
        return f"<EmailScriptsRelation(id:{self.id}, id_script:{self.name})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
