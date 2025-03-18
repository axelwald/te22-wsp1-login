import express from "express"
import pool from "../db.js"


const router = express.Router()

router.get("/", async (req, res) => {
    
    res.render("index.njk", {
      title: "Qvixter - All posts",
      message: "Message from routes/index.js",
    })
  })
  router.post("/", async (req, res) => {
    
    res.redirect("/")
  })