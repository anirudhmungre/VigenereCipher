"use strict"
const PORT = 3770
const express = require("express")
const app = express()
const path = require("path")
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')
const http = require("http").Server(app)

const index = require('./app/routes/index')
const api = require('./app/routes/api')

// Server setup
app.use(fileUpload())
app.use(express.static(path.join(__dirname, "app", "public")))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set("views", path.join(__dirname, "app", "views"))
app.set("view engine", "jade")
// app.use(logger('dev'))
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
} catch (e) {
  console.error("\n\n[ERROR] An Error has occured!\n" + e)
}