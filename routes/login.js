import express from "express"
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


export default router