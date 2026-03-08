from pydantic import BaseModel

class Login(BaseModel):
    username: str
    password: str
    role: str

class Signup(BaseModel):
    username: str
    email: str
    password: str

# 🔥 ADD THIS
class OpinionSchema(BaseModel):
    record_id: str
    policy_id: str
    description: str
    date_announced: str
    comment: str
    type: str
    username: str   # must exist

class YoutubeURL(BaseModel):
    url: str

