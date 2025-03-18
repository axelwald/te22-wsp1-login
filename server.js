import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import logger from "morgan"
import bcrypt from "bcrypt"
import session from "express-session"


const app = express()
const port = 3000




nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(logger("dev"))
app.use(express.static("public"))

let myPlaintextPassword = "detlösenordsomduvillha"
bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
	// här får vi nu tag i lösenordets hash i variabeln hash
	console.log(hash)


})



app.use(session({
  secret: "keyboard cat ",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))


app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  res.render("index.njk",
    { title: "Test", message: "Funkar?", views: req.session.views }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})