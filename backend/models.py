from sqlalchemy import Column, Integer, String
from database import Base

# ---------------- USERS ----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String)
    password = Column(String)
    role = Column(String)


# ---------------- DATASETS ----------------
class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)


# ---------------- OPINIONS ----------------
class Opinion(Base):
    __tablename__ = "opinions"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(String)
    policy_id = Column(String)
    description = Column(String)
    date_announced = Column(String)
    comment = Column(String)
    username = Column(String)
    datetime = Column(String)
    type = Column(String)

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(2000), nullable=False)
    likes = Column(Integer, default=0)
    sentiment = Column(String(50), nullable=False)
