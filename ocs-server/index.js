require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const pool = require("./db");
const auth = require("./auth");

const app = express();
app.use(express.json());
app.use(cors());

/* ===================== LOGIN ===================== */
app.post("/api/login", async (req, res) => {
  try {
    const { userid, password_md5 } = req.body;

    const result = await pool.query(
      "SELECT userid, role FROM users WHERE userid=$1 AND password_hash=$2",
      [userid, password_md5]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { userid: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===================== CURRENT USER ===================== */
app.get("/api/users/me", auth(), (req, res) => {
  res.json(req.user);
});

/* ===================== PROFILES (ALL) ===================== */
app.get("/api/profiles", auth(), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT profile_code, company_name, designation, recruiter_email
      FROM profile
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===================== ADMIN: ALL USERS ===================== */
app.get("/api/admin/users", auth("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT userid, role
      FROM users
      ORDER BY role, userid
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ===================== STUDENT: MY APPLICATIONS ===================== */
app.get("/api/my-applications", auth("student"), async (req, res) => {
  const result = await pool.query(
    `
    SELECT a.profile_code, a.status, p.company_name, p.designation
    FROM application a
    JOIN profile p ON a.profile_code = p.profile_code
    WHERE a.entry_number = $1
    `,
    [req.user.userid]
  );
  res.json(result.rows);
});

/* ===================== STUDENT: APPLY ===================== */
app.post("/api/apply", auth("student"), async (req, res) => {
  const { profile_code } = req.body;
  const student = req.user.userid;

  const accepted = await pool.query(
    "SELECT 1 FROM application WHERE entry_number=$1 AND status='Accepted'",
    [student]
  );
  if (accepted.rows.length) {
    return res.status(400).json({ error: "Already accepted an offer" });
  }

  const exists = await pool.query(
    "SELECT 1 FROM application WHERE profile_code=$1 AND entry_number=$2",
    [profile_code, student]
  );
  if (exists.rows.length) {
    return res.status(400).json({ error: "Already applied" });
  }

  await pool.query(
    "INSERT INTO application VALUES ($1,$2,'Applied')",
    [profile_code, student]
  );

  res.json({ success: true });
});

/* ===================== STUDENT: ACCEPT ===================== */
app.post("/api/application/accept", auth("student"), async (req, res) => {
  await pool.query(
    "UPDATE application SET status='Accepted' WHERE profile_code=$1 AND entry_number=$2",
    [req.body.profile_code, req.user.userid]
  );
  res.json({ success: true });
});

/* ===================== STUDENT: REJECT ===================== */
app.post("/api/application/reject", auth("student"), async (req, res) => {
  await pool.query(
    "UPDATE application SET status='Not Selected' WHERE profile_code=$1 AND entry_number=$2",
    [req.body.profile_code, req.user.userid]
  );
  res.json({ success: true });
});

/* ===================== RECRUITER: PROFILES ===================== */
app.get("/api/recruiter/profiles", auth("recruiter"), async (req, res) => {
  const result = await pool.query(
    "SELECT profile_code, company_name, designation FROM profile WHERE recruiter_email=$1",
    [req.user.userid]
  );
  res.json(result.rows);
});

/* ===================== RECRUITER: APPLICATIONS ===================== */
app.get("/api/recruiter/applications", auth("recruiter"), async (req, res) => {
  const result = await pool.query(
    `
    SELECT a.profile_code, a.entry_number, a.status,
           p.company_name, p.designation
    FROM application a
    JOIN profile p ON a.profile_code = p.profile_code
    WHERE p.recruiter_email = $1
    `,
    [req.user.userid]
  );
  res.json(result.rows);
});

// ================= RECRUITER: CREATE PROFILE =================
app.post("/api/recruiter/profile", auth("recruiter"), async (req, res) => {
  const { company_name, designation } = req.body;
  const recruiter_email = req.user.userid; // from JWT

  if (!company_name || !designation) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO profile (company_name, designation, recruiter_email)
      VALUES ($1, $2, $3)
      RETURNING profile_code
      `,
      [company_name, designation, recruiter_email]
    );

    res.json({
      message: "Profile created",
      profile_code: result.rows[0].profile_code
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= ADMIN: CREATE PROFILE =================
app.post("/api/admin/profile", auth("admin"), async (req, res) => {
  const { recruiter_email, designation } = req.body;

  if (!recruiter_email || !designation) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Optional safety: ensure recruiter exists
    const recruiterCheck = await pool.query(
      "SELECT 1 FROM users WHERE userid = $1 AND role = 'recruiter'",
      [recruiter_email]
    );

    if (recruiterCheck.rowCount === 0) {
      return res.status(400).json({ error: "Invalid recruiter" });
    }

    const company_name = recruiter_email.split("@")[1].split(".")[0];

    const result = await pool.query(
      `
      INSERT INTO profile (company_name, designation, recruiter_email)
      VALUES ($1, $2, $3)
      RETURNING profile_code
      `,
      [company_name, designation, recruiter_email]
    );

    res.json({
      message: "Profile created",
      profile_code: result.rows[0].profile_code
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= ADMIN: LIST RECRUITERS =================
app.get("/api/admin/recruiters", auth("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT userid FROM users WHERE role = 'recruiter' ORDER BY userid"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ===================== CHANGE STATUS (RECRUITER / ADMIN) ===================== */
app.post("/api/application/change_status", auth(), async (req, res) => {
  const { profile_code, entry_number, status } = req.body;
  const role = req.user.role;

  if (role !== "recruiter" && role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (role === "recruiter") {
    const owns = await pool.query(
      "SELECT 1 FROM profile WHERE profile_code=$1 AND recruiter_email=$2",
      [profile_code, req.user.userid]
    );
    if (!owns.rows.length) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  /* 🚨 HARD RULE: Accepted means LOCKED */
  const accepted = await pool.query(
    "SELECT 1 FROM application WHERE entry_number=$1 AND status='Accepted'",
    [entry_number]
  );

  if (accepted.rows.length) {
    return res.status(400).json({
      error: "Student has already accepted an offer. Status cannot be changed."
    });
  }

  await pool.query(
    "UPDATE application SET status=$1 WHERE profile_code=$2 AND entry_number=$3",
    [status, profile_code, entry_number]
  );

  res.json({ success: true });
});

/* ===================== ADMIN: ALL APPLICATIONS ===================== */
app.get("/api/admin/applications", auth("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.profile_code,
        a.entry_number,
        a.status,
        p.company_name,
        p.designation,
        p.recruiter_email
      FROM application a
      JOIN profile p ON a.profile_code = p.profile_code
      ORDER BY p.company_name, a.profile_code
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ===================== START ===================== */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
  console.log(process.env.PORT || 3000)
});
