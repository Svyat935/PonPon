from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey, PickleType
from sqlalchemy.orm import relation, relationship


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="settings")
    telegram_token = Column(String, nullable=True)
    email_token = Column(PickleType, nullable=True)

    def __repr__(self):
        return f"<Settings(id:{self.id}, user_id:{self.user_id}, token:{self.telegram_token}"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
