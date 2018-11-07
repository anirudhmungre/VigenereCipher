"use strict"
const PORT = 80
const express = require("express")
const app = express()
const path = require("path")
const logger = require("morgan")
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const os = require("os")
const http = require("http").Server(app)
const fs = require("fs")


// Local requires
const encrypt = require('./encryption')

String.prototype.strip = function() {
  return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}

// Server setup
app.use(fileUpload())
app.use(express.static(path.join(__dirname, "app", "public")))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set("views", path.join(__dirname, "app", "views"))
app.set("view engine", "jade")
// app.use(logger('dev'))
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

app.get("/encrypt", (req, res) => {
  res.render("encrypt", {
    title: "Encrypt String"
  })
})

app.post("/do-encrypt", (req, res) => {
  console.log(req.body)
  if (req.body.inputMethod) {
    let dataToEncrypt = ""
    if (req.body.inputMethod === 'file') {
      if (Object.keys(req.files).length == 0) { 
        res.json({"ERROR":"No File Uploaded..."}) 
      } else {
        dataToEncrypt = req.files.strFile.data.toString("utf-8").strip()
      }
    } else if (req.body.inputMethod === 'string') {
      dataToEncrypt = req.body.strString.strip()
    }
    let encrypted = encrypt.enc(dataToEncrypt, req.body.key.strip())
    res.json({
      "raw": dataToEncrypt, 
      "enc": encrypted
    })
  } else {
    res.json({"ERROR":"Invalid request."}) 
  }
  
})

app.get("/decrypt-bruteforce", (req, res) => {
  res.render("decryptbruteforce", {
    title: "Decrypt Bruteforce"
  })
})

app.get("/decrypt-pso", (req, res) => {
  res.render("decryptpso", {
    title: "Decrypt PSO"
  })
})


// Start server and listen on port
try {
  http.listen(PORT)
  main()
} catch (e) {
  console.error("\n\n[ERROR] An Error has occured!\n" + e)
}