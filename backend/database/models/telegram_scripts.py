from database.connect import Base, create_session
from sqlalchemy import Column, Integer, ForeignKey, JSON, String
from sqlalchemy.orm import relationship


class TelegramScript(Base):
    __tablename__ = "telegram_scripts"

    id = Column(Integer, primary_key=True)
    user = relationship("TelegramBehavior", back_populates="script")
    text = Column(String)
    command = Column(String)
    buttons = Column(JSON)

    def __repr__(self):
        return f"<TelegramScript(id:{self.id}, script_id:{self.script_id})>"

    async def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
