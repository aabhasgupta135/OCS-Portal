# OCS Portal 🎓💼

An Online Campus Recruitment Portal that allows students to apply for company profiles, recruiters to manage applications, and admins to oversee the platform. Built using Node.js, Supabase (PostgreSQL), HTML/CSS/JS.

---

## 🌐 Live Demo

- **Frontend (Vercel):** https://ocs-recruitment-portal.vercel.app/  
- **Backend (Render):** https://ocs-server-sok3.onrender.com/ *(used by frontend automatically)*

---

## 🔧 Tech Stack

- **Frontend:** Vanilla JS, HTML, CSS  
- **Backend:** Node.js + Express  
- **Database:** Supabase PostgreSQL  
- **Deployment:** Vercel (Frontend) & Render (Backend)  

---

## 🧑‍💼 User Roles

### 👩‍🎓 Student
- Login with entry number and password.
- View available profiles with company name, designation, and profile code.
- Apply to eligible profiles.
- View selection status (Selected, Accepted, Rejected).

### 🧑‍💼 Recruiter
- Login with company email.
- View recruiter dashboard and create job/internship profiles.
- View applications submitted to their own profiles.
- Select or reject students.

### 🛠 Admin
- Login as admin user.
- View all users, profiles, and applications.
- Create profiles for any recruiter.
- Modify application status.
- View recruiter email and profile codes.

---

## 🚀 Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- Supabase or PostgreSQL database
- Git installed

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/OCS-Portal.git
cd OCS-Portal
```

### 2. Install Backend Dependencies

```bash
cd ocs-server
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the `ocs-server` folder:

```env
DATABASE_URL=your_supabase_connection_string
PORT=3000
```

Make sure this file is added to `.gitignore`.

### 4. Start Backend Server

```bash
node index.js
```

### 5. Launch Frontend

Open `index.html` directly in your browser or use a simple server like:

```bash
npx serve .
```

---

## 🧪 Sample Data Reset

To reset and reinitialize your database:

1. Run the SQL script provided in `reset.sql` (if present).
2. Or manually clear all tables and rerun the setup SQL.

---

## 🌍 Deployment

### Frontend on Vercel

- Connect GitHub repo
- Set root directory to `/` (or wherever `index.html` is)
- Deploy!

### Backend on Render

- Create a new Web Service
- Use `index.js` as entry
- Add `DATABASE_URL` to environment variables
- Deploy!

---

## 📁 Folder Structure

```
OCS-Portal/
├── index.html         # Frontend
└── ocs-server/
    ├── index.js       # Express backend
    ├── db.js          # PostgreSQL connection
    ├── auth.js        # Auth middleware
    └── .env           # DB credentials (excluded from Git)
```

---

## ✅ Features Completed

- [x] Student application flow
- [x] Recruiter profile & selection
- [x] Admin control over all data
- [x] Password hashing (MD5)
- [x] Token-based auth
- [x] Responsive UI with dark mode
- [x] Deployed on Vercel & Render

---

## ✍️ Author

Made by Aabhas Gupta  
GitHub: [@aabhasgupta135](https://github.com/aabhasgupta135)