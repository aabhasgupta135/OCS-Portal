# OCS Recruitment Portal

A simple, role-based web portal for managing campus recruitment. Built with vanilla HTML/CSS/JS (frontend) and Node.js (backend).

---

## 🚀 Features

### 👨‍🎓 Student
- View eligible job/internship profiles
- Apply to profiles
- Track application statuses
- Accept/Reject offers

### 🧑‍💼 Recruiter
- View their own dashboard and details
- Post and manage job/internship profiles
- View applications to their profiles
- Select/Reject students

### 🛠 Admin
- View all users (students & recruiters)
- Create job/internship profiles for any recruiter
- View and change any application status
- View all profiles with management-only fields

---

## 🛠 Tech Stack
- Node.js + Express (Backend)
- HTML, CSS, JavaScript (Frontend)
- [blueimp-md5](https://www.npmjs.com/package/blueimp-md5) for hashing passwords

---

## 📂 Project Structure
```
├── index.js           # Main server file
├── auth.js            # Authentication logic
├── db.js              # In-memory database / mock data
├── public/
│   ├── index.html     # Frontend UI
│   └── style.css      # [optional] custom styles
├── .env               # Configurable environment variables
```

---

## ⚙️ Setup & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ocs-portal.git
cd ocs-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```
PORT=3000
```

### 4. Start the server
```bash
node index.js
```

### 5. Open in browser
Visit: [http://localhost:3000](http://localhost:3000)

---

## 📋 Default Users (for testing)
| User ID              | Password | Role      |
|----------------------|----------|-----------|
| student1             | 123      | student   |
| recruiter1@acme.com  | 123      | recruiter |
| admin                | 123      | admin     |

---

## 🚧 Future Enhancements
- Persistent database (MongoDB/PostgreSQL)
- File upload for resumes
- Admin analytics dashboard
- Email notifications for updates

---

