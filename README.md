# 📊 Public Opinion Analysis System

**React + FastAPI Project**

This project is a full-stack web application with:

* **Frontend:** React + Tailwind CSS
* **Backend:** Python FastAPI
* **Database:** SQLite
* **Auth:** JWT login system

It supports:

* Admin dashboard
* Dataset upload & analysis
* User opinions (positive/negative)
* Recommendations system

---

# 🖥️ FRONTEND SETUP (React)

## 📁 Folder Structure

```
frontend/
 ┣ src/
 ┃ ┣ pages/
 ┃ ┣ services/api.js
 ┃ ┣ App.js
 ┃ ┗ index.css
```

## 🔧 Install dependencies

```bash
cd frontend
npm install
npm install axios react-router-dom
```

## 🎨 Install Tailwind CSS

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js**

```js
export default {
  content: ["./src/**/*.{js,jsx}", "./index.html"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## ▶ Run frontend

```bash
npm start
```

Runs at:

```
http://localhost:3000
```

---

# 🐍 BACKEND SETUP (FastAPI)

## 📁 Folder Structure

```
backend/
 ┣ main.py
 ┣ models.py
 ┣ schemas.py
 ┣ database.py
 ┣ auth.py
 ┣ requirements.txt
 ┗ uploads/
```

## 🔧 Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

## ▶ Run backend

```bash
uvicorn main:app --reload
```

Runs at:

```
http://localhost:8000
```

API docs:

```
http://localhost:8000/docs
```

---

# 🔐 LOGIN DETAILS

### Admin Login

```
username: admin
password: admin123
```

### User

Create account from signup page.

---

# 🔗 API CONNECTION

Frontend connects to backend using:

```
src/services/api.js
```

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export default API;
```

---

# 📦 FEATURES

### 👨‍💼 Admin

* Upload dataset
* View datasets
* Analyze datasets
* View opinions
* View positive feedback
* View negative feedback
* View recommendations

### 👤 User

* Register & login
* View datasets
* Give opinion
* View feedback
* View recommendations

---

# 🧪 TEST FLOW

1. Start backend
2. Start frontend
3. Login as admin
4. Upload dataset
5. Login as user
6. Give opinion
7. View in admin panel

---

# 🚀 RUN BOTH

Open two terminals:

### Terminal 1

```bash
cd backend
uvicorn main:app --reload
```

### Terminal 2

```bash
cd frontend
npm start
```

---

# 📌 TECH STACK

* React
* Tailwind CSS
* FastAPI
* SQLite
* JWT Auth
* Axios

---

# 👨‍💻 Developer Notes

* Uploads saved in `/backend/uploads`
* Database file: `app.db`
* Change admin credentials in `main.py` if needed
* CORS enabled for local development

---

# 🟢 Project Ready

Frontend + Backend fully connected.
