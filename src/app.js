"use strict"
console.log(`Start`)
const PORT = 3770
const express = require("express")
const app = express()
const path = require("path")
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const fileUpload = require('express-fileupload')
const http = require("http").Server(app)
console.log(`Imports`)

const index = require('./app/routes/index')
const api = require('./app/routes/api')
console.log(`Routes`)

// Server setup
app.use(fileUpload())
app.use(express.static(path.join(__dirname, "app", "public")))
app.set("views", path.join(__dirname, "app", "views"))
app.set("view engine", "jade")
app.use(compression())
app.use(helmet())
app.use(bodyParser.json({
  limit: '512mb'
}))
app.use(bodyParser.urlencoded({
  limit: '512mb',
  extended: true
}))
app.set("port", PORT)

app.use('/', index)
app.use('/api', api)

// Start server and listen on port
try {
  http.listen(PORT)
  console.log(`Listening on port: ${PORT}`)
} catch (e) {
  console.error("\n\n[ERROR] An Error has occured!\n" + e)
}
