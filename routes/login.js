import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"


const router = express.Router()




router.get("/", async (req, res) => {
  if (!req.session.loggedin) {
    return res.redirect("/login");
  }
  res.render("index.njk", {
    title: "Qvixter - All posts",
    message: `Välkommen ${req.session.username}`,
    username: req.session.username
  });
});

router.post("/", async (req, res) => {
  res.redirect("/");
});


router.get("/login", (req, res) => {
  res.render("login.njk", {
    title: "Logga in",
    message: "Fyll i dina uppgifter för att logga in",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login.njk", {
      title: "Login error",
      message: "Användarnamn och lösenord krävs",
    });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [username]);
    const user = rows[0];

    if (!user) {
      return res.render("login.njk", {
        title: "Login failed",
        message: "Användaren finns inte",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login.njk", {
        title: "Login failed",
        message: "Fel lösenord",
      });
    }

    req.session.loggedin = true;
    req.session.username = username;
    req.session.role = user.role

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login.njk", {
      title: "Login error",
      message: "Serverfel vid inloggning",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Kunde inte logga ut");
    }
    res.redirect("/");
  });
});





router.get("/createuser", async (req, res) => {
 
  res.render("createuser.njk", {
    title: "Skapa ny användare",
    message: "Set a Username, password and an email to create a new user",
  });
});

router.post("/createuser", async (req, res) => {
  const { user, message } = req.body;
  const username = user?.trim()
  const password = message?.trim()

  if (!username || !password || username.length > 32 || password.length > 255) {
    return res.render("index.njk", {
      title: "Sign up failed",
      message: "Invalid input: username or password too short or long",
    })
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE name = ?", [username])
    if (existing.length > 0) {
      return res.render("index.njk", {
        title: "Sign up failed",
        message: "Username already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      "INSERT INTO users (name, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [username, hashedPassword]
    )

    res.render("index.njk", {
      title: "Sign up successful",
      message: `User '${username}' created successfully!`,
    })
  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).render("index.njk", {
      title: "Sign up failed",
      message: "Server error during signup",
    })
  }
  
});


router.get("/admin/users", async (req, res) => {
  console.log(req.session.role)
  if (!req.session.loggedin || req.session.role !== "admin") {
    return res.status(403).render("index.njk", {
      title: "Åtkomst nekad",
      message: "Du har inte behörighet att se denna sida.",
    });
  }

  try {
    const [users] = await pool.query("SELECT id, name, created_at FROM users");
    res.render("admin_users.njk", {
      title: "Alla användare",
      users,
      username: req.session.username
    });
  } catch (err) {
    console.error("Kunde inte hämta användare:", err);
    res.status(500).render("index.njk", {
      title: "Fel",
      message: "Det gick inte att hämta användare.",
    });
  }
});




export default router