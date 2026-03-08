from fastapi import FastAPI, Depends, UploadFile, File, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, schemas, auth
from passlib.context import CryptContext
import os, json, pandas as pd
from datetime import datetime
from sentiment import get_sentiment   
from schemas import YoutubeURL
from dotenv import load_dotenv
import requests

# ---------------- INIT ----------------
app = FastAPI()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
Base.metadata.create_all(bind=engine)
# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
# folders
if not os.path.exists("uploads"):
    os.makedirs("uploads")

OP_FILE = "opinions.json"
if not os.path.exists(OP_FILE):
    with open(OP_FILE, "w") as f:
        json.dump([], f)
# ---------------- DB ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    print("⚠️ WARNING: YOUTUBE_API_KEY not found in .env")

# ---------- Extract Video ID ----------
def extract_video_id(url: str):
    if not url:
        return None

    if "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    return None

# ---------- Fetch Video Title ----------
def fetch_video_title(video_id):

    url = "https://www.googleapis.com/youtube/v3/videos"

    params = {
        "part": "snippet",
        "id": video_id,
        "key": API_KEY
    }
    res = requests.get(url, params=params)
    if res.status_code != 200:
        return ""
    data = res.json()
    if not data.get("items"):
        return ""
    return data["items"][0]["snippet"]["title"]

# ---------- Fetch Comments ----------
def fetch_comments(video_id):
    youtube_url = "https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part": "snippet",
        "videoId": video_id,
        "key": API_KEY,
        "maxResults": 50
    }
    response = requests.get(youtube_url, params=params)
    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="YouTube API error"
        )
    data = response.json()
    if "items" not in data:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube response"
        )
    comments = []
    for item in data["items"]:
        snippet = item["snippet"]["topLevelComment"]["snippet"]
        text = snippet.get("textDisplay", "")
        likes = snippet.get("likeCount", 0)
        comments.append({
            "text": text,
            "likes": likes,
            "sentiment": get_sentiment(text)
        })
    return comments

# ---------- Fetch from Frontend ----------
@app.post("/youtube/fetch")
def youtube_fetch(data: YoutubeURL, db: Session = Depends(get_db)):
    url = data.url
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    # extract video id
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    # fetch title
    title = fetch_video_title(video_id)
    # fetch comments + sentiment
    comments = fetch_comments(video_id)
    # clear old comments
    db.query(models.Comment).delete()
    # store new comments
    for c in comments:
        db.add(models.Comment(
            text=c["text"],
            likes=c["likes"],
            sentiment=c["sentiment"]
        ))

    db.commit()
    # save title temp
    with open("video_title.txt", "w", encoding="utf-8") as f:
        f.write(title)
    return {
        "message": "Comments stored successfully",
        "count": len(comments),
        "title": title
    }

@app.get("/youtube/summary")
def youtube_summary(db: Session = Depends(get_db)):
    total = db.query(models.Comment).count()
    positive = db.query(models.Comment)\
                 .filter(models.Comment.sentiment == "positive")\
                 .count()
    negative = db.query(models.Comment)\
                 .filter(models.Comment.sentiment == "negative")\
                 .count()
    neutral = total - (positive + negative)
    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }

# ================= LOGIN =================
@app.post("/login")
def login(data: schemas.Login, db: Session = Depends(get_db)):
    # admin login
    if data.role == "admin":
        if data.username == "admin" and data.password == "admin123":
            token = auth.create_token({"username": "admin"})
            return {"token": token}
        raise HTTPException(401, "Invalid admin")
    # user login
    user = db.query(models.User).filter_by(username=data.username).first()
    if not user:
        raise HTTPException(401, "User not found")
    if not pwd.verify(data.password[:72], user.password):
        raise HTTPException(401, "Wrong password")
    token = auth.create_token({"username": user.username})
    return {"token": token}

# ================= SIGNUP =================
@app.post("/signup")
def signup(data: schemas.Signup, db: Session = Depends(get_db)):
    # check if user exists
    existing = db.query(models.User).filter_by(username=data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = pwd.hash(data.password.strip())
    user = models.User(
        username=data.username,
        email=data.email,
        password=hashed,
        role="user"
    )
    db.add(user)
    db.commit()
    return {"msg": "Account created"}

# ================= UPLOAD DATASET =================
@app.post("/admin/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1]
    if ext not in ["csv", "xlsx", "xls"]:
        return {"error": "Only Excel/CSV"}
    path = f"uploads/{file.filename}"
    with open(path, "wb") as buffer:
        buffer.write(await file.read())
    return {"msg": "Dataset uploaded"}

# ================= VIEW DATASET =================
@app.get("/admin/datasets")
def view_datasets():
    all_rows = []
    upload_dir = os.path.join(os.getcwd(), "uploads")
    if not os.path.exists(upload_dir):
        return []
    for file in os.listdir(upload_dir):
        file_path = os.path.join(upload_dir, file)
        try:
            if file.endswith(".csv"):
                df = pd.read_csv(file_path)
            elif file.endswith(".xlsx") or file.endswith(".xls"):
                df = pd.read_excel(file_path)
            else:
                continue
            rows = df.fillna("").to_dict(orient="records")
            # add sentiment automatically
            for r in rows:
                text = (
                    r.get("text")
                    or r.get("review")
                    or r.get("comment")
                    or r.get("feedback")
                    or ""
                )
                rating = r.get("rating", 0)
                r["sentiment"] = get_sentiment(rating, text)
            all_rows.extend(rows)
        except Exception as e:
            print("DATASET ERROR:", e)
    return all_rows

@app.get("/sentiment-counts")
def sentiment_counts():
    pos = 0
    neg = 0
    neu = 0
    upload_dir = os.path.join(os.getcwd(), "uploads")
    # ---- DATASET COUNTS ----
    if os.path.exists(upload_dir):
        for file in os.listdir(upload_dir):
            path = os.path.join(upload_dir, file)
            try:
                if file.endswith(".csv"):
                    df = pd.read_csv(path)
                else:
                    df = pd.read_excel(path)
                rows = df.fillna("").to_dict(orient="records")
                for r in rows:
                    rating = r.get("public_rating")
                    s = get_sentiment(rating)

                    if s == "positive":
                        pos += 1
                    elif s == "negative":
                        neg += 1
                    else:
                        neu += 1
            except:
                pass
    # ---- USER OPINIONS COUNTS ----
    if os.path.exists("opinions.json"):
        with open("opinions.json", "r") as f:
            arr = json.load(f)
        for r in arr:
            s = r.get("sentiment")
            if s == "positive":
                pos += 1
            elif s == "negative":
                neg += 1
            else:
                neu += 1
    return {"positive": pos, "negative": neg, "neutral": neu}

@app.get("/positive-feedback")
def positive_feedback():
    results = []
    upload_dir = os.path.join(os.getcwd(), "uploads")
    # DATASET
    if os.path.exists(upload_dir):
        for file in os.listdir(upload_dir):
            path = os.path.join(upload_dir, file)
            try:
                if file.endswith(".csv"):
                    df = pd.read_csv(path)
                else:
                    df = pd.read_excel(path)
                rows = df.fillna("").to_dict(orient="records")
                for r in rows:
                    rating = r.get("public_rating")
                    sentiment = get_sentiment(rating)
                    if sentiment == "positive":
                        r["sentiment"] = sentiment
                        results.append(r)
            except:
                pass
    # USER OPINIONS
    if os.path.exists("opinions.json"):
        with open("opinions.json", "r") as f:
            arr = json.load(f)
        for r in arr:
            if r.get("sentiment") == "positive":
                results.append(r)
    return results

@app.get("/negative-feedback")
def negative_feedback():
    results = []
    upload_dir = os.path.join(os.getcwd(), "uploads")
    # DATASET
    if os.path.exists(upload_dir):
        for file in os.listdir(upload_dir):
            path = os.path.join(upload_dir, file)
            try:
                if file.endswith(".csv"):
                    df = pd.read_csv(path)
                else:
                    df = pd.read_excel(path)
                rows = df.fillna("").to_dict(orient="records")
                for r in rows:
                    rating = r.get("public_rating")
                    s = get_sentiment(rating)

                    if s == "negative":
                        r["sentiment"] = "negative"
                        results.append(r)
            except:
                pass
    # USER OPINIONS
    if os.path.exists("opinions.json"):
        with open("opinions.json", "r") as f:
            arr = json.load(f)
        for r in arr:
            if r.get("sentiment") == "negative":
                results.append(r)
    return results

# ================= USER VIEW DATASET =================
@app.get("/user/details")
def user_details():
    all_rows = []
    upload_dir = os.path.join(os.getcwd(), "uploads")
    if not os.path.exists(upload_dir):
        return []
    for file in os.listdir(upload_dir):
        path = os.path.join(upload_dir, file)
        try:
            if file.endswith(".csv"):
                df = pd.read_csv(path)
            else:
                df = pd.read_excel(path)
            rows = df.fillna("").to_dict(orient="records")
            all_rows.extend(rows)
        except Exception as e:
            print("ERROR:", e)
    return all_rows

# ================= ADD OPINION =================
OPINION_FILE = "opinions.json"

@app.post("/user/opinion")
def save_opinion(data: dict):
    # get values
    rating = data.get("rating")
    comment = data.get("comment", "")
    # 🔥 calculate sentiment
    sentiment = get_sentiment(rating, comment)
    data["sentiment"] = sentiment   # add sentiment to record
    # create file if not exists
    if not os.path.exists(OPINION_FILE):
        with open(OPINION_FILE, "w") as f:
            json.dump([], f)
    # read old data
    with open(OPINION_FILE, "r") as f:
        arr = json.load(f)
    # add new opinion
    arr.append(data)
    # save again
    with open(OPINION_FILE, "w") as f:
        json.dump(arr, f, indent=4)
    return {"msg": "Opinion saved", "sentiment": sentiment}

# ================= GRAPH =================
@app.get("/admin/graph")
def graph():
    with open(OP_FILE) as f:
        data = json.load(f)

    pos = len([x for x in data if x["sentiment"] == "positive"])
    neg = len([x for x in data if x["sentiment"] == "negative"])
    neu = len([x for x in data if x["sentiment"] == "neutral"])

    return {
        "positive": pos,
        "negative": neg,
        "neutral": neu
    }
