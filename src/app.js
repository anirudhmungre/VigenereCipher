"use strict"
const PORT = 80
const express = require("express")
const app = express()
const path = require("path")
const logger = require("morgan")
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const os = require("os")
const http = require("http").Server(app)
const fs = require("fs")

// Server setup
app.use(express.static(path.join(__dirname, "app", "public")))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set("views", path.join(__dirname, "app", "views"))
app.set("view engine", "jade")
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '512mb' }))
app.use(bodyParser.urlencoded({ limit: '512mb', extended: true }))
app.set("port", PORT)

// Main functions here
function main() { }

// Register endpoints
app.get("/", (req, res) => {
  res.render("index", {
    title: "Index"
  })
})

// Start server and listen on port
try {
  http.listen(PORT)
  main()
} catch (e) {
  console.error("\n\n[ERROR] An Error has occured!\n" + e)
}