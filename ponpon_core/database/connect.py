from sqlalchemy import create_engine

DB_USER = "m_user"
DB_PASSWORD = "m_password"
DB_HOST = "ponpon_db"
DB_PORT = "3306"
DB_NAME = "ponpon"
DB_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}{DB_PORT}/{DB_NAME}"

engine = create_engine(DB_URL)
Session_Local =