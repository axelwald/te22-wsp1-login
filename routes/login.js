import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"
import req from "express/lib/request.js"


const router = express.Router()




router.get("/", async (req, res) => {
  res.render("index.njk", {
    title: "Qvixter - All posts",
    message: "Message from routes/index.js",
  });
});

router.post("/", async (req, res) => {
  res.redirect("/");
});

router.get("/createuser", async (req, res) => {
 
  res.render("createuser.njk", {
    title: "Skapa ny användare",
    message: "Set a Username, password and an email to create a new user",
  });
});

router.post("/createuser", async (req, res) => {
  const { user, password } = req.body;
  console.log("User:", user);
  console.log("Password:", password);

  // Validate input (basic example)
  if (!user || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Example database insert
  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [user, password]
    );
    res.redirect("/"); // Redirect after success
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Something went wrong");
  }
});

export default router