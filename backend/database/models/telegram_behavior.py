from database.connect import Base, create_session
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class TelegramBehavior(Base):
    __tablename__ = "telegram_behavior"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    script_id = Column(Integer, ForeignKey("telegram_scripts.id"), primary_key=True)
    user = relationship("User", back_populates="telegram")
    script = relationship("TelegramScript", back_populates="user")

    def __repr__(self):
        return f"<TelegramBehavior(user_id:{self.user_id}, script_id:{self.script_id})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
