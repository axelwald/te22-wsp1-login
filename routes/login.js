import express from "express"
import bcrypt from "bcrypt"
import db from "../db-sqlite.js"

const router = express.Router()

// Startsida (kräver inloggning)
router.get("/", async (req, res) => {
  if (!req.session.loggedin) {
    return res.redirect("/login")
  }

  res.render("index.njk", {
    title: "Qvixter - All posts",
    message: `Välkommen ${req.session.username}`,
    username: req.session.username,
    role: req.session.role
  })
})

// Visa login-formulär
router.get("/login", (req, res) => {
  res.render("login.njk", {
    title: "Logga in",
    message: "Fyll i dina uppgifter för att logga in",
  })
})

// Hantera inloggning
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.render("login.njk", {
      title: "Login error",
      message: "Användarnamn och lösenord krävs",
    })
  }

  try {
    const users = await db.all("SELECT * FROM user WHERE name = ?", [username])
    const user = users[0]

    if (!user) {
      return res.render("login.njk", {
        title: "Login failed",
        message: "Användaren finns inte",
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.render("login.njk", {
        title: "Login failed",
        message: "Fel lösenord",
      })
    }

    req.session.loggedin = true
    req.session.username = user.name
    req.session.role = user.role

    res.redirect("/")
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).render("login.njk", {
      title: "Login error",
      message: "Serverfel vid inloggning",
    })
  }
})

// Logga ut
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Kunde inte logga ut")
    }
    res.redirect("/login")
  })
})

// Visa skapa användare-formulär
router.get("/createuser", async (req, res) => {
  res.render("createuser.njk", {
    title: "Skapa ny användare",
    message: "Välj användarnamn och lösenord för att skapa ett konto",
  })
})

// Hantera nyregistrering
router.post("/createuser", async (req, res) => {
  const { user, message } = req.body
  const username = user?.trim()
  const password = message?.trim()

  if (!username || !password || username.length > 32 || password.length > 255) {
    return res.render("index.njk", {
      title: "Sign up failed",
      message: "Felaktig input: användarnamn eller lösenord saknas eller är för långt",
    })
  }

  try {
    const existing = await db.all("SELECT id FROM user WHERE name = ?", [username])
    if (existing.length > 0) {
      return res.render("index.njk", {
        title: "Sign up failed",
        message: "Användarnamnet är redan taget",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.run(
      "INSERT INTO user (name, password, role, created_at, updated_at) VALUES (?, ?, 'user', datetime('now'), datetime('now'))",
      [username, hashedPassword]
    )

    res.render("index.njk", {
      title: "Sign up successful",
      message: `Användaren '${username}' skapades! Du kan nu logga in.`,
    })
  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).render("index.njk", {
      title: "Sign up failed",
      message: "Serverfel vid registrering",
    })
  }
})

// Visa alla användare (endast för admin)
router.get("/admin/users", async (req, res) => {
  if (!req.session.loggedin || req.session.role !== "admin") {
    return res.status(403).render("index.njk", {
      title: "Åtkomst nekad",
      message: "Du har inte behörighet att se denna sida.",
    })
  }

  try {
    const users = await db.all("SELECT id, name, role, created_at FROM user")
    res.render("admin_users.njk", {
      title: "Alla användare",
      users,
      username: req.session.username
    })
  } catch (err) {
    console.error("Kunde inte hämta användare:", err)
    res.status(500).render("index.njk", {
      title: "Fel",
      message: "Det gick inte att hämta användare.",
    })
  }
})

export default router
