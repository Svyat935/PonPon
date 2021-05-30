from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DB_USER = "p_user"
DB_PASSWORD = "p_password"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "ponpon"
DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DB_URL)
Session_Local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@contextmanager
def create_session() -> Session:
    """Create database session.

    :return: Database session.
    """
    session = Session_Local()
    try:
        yield session
    finally:
        session.close()
