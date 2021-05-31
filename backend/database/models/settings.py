from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relation, relationship


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    parent = relationship("User", back_populates="settings")
    telegram_token = Column(String)

    def __repr__(self):
        return f"<Settings(id:{self.id}, user_id:{self.user_id}, token:{self.telegram_token}"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
