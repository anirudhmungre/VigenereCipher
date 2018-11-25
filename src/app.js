"use strict"
const PORT = 3770
const express = require("express")
const socketio = require('socket.io')
const app = express()
const path = require("path")
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const fileUpload = require('express-fileupload')
const http = require("http").Server(app)
//Include Local API route
const api = require('./app/routes/api')

//Serve static files from public (VUE front-end)
app.use(express.static(path.join(__dirname, "app", "public")))
// Server setup
app.use(fileUpload()) // Allow file-upload to server
app.use(compression()) // Enable GZIP compression for faster load times
app.use(helmet()) // Basic NODE security suite
app.use(bodyParser.json({
    limit: '512mb'
})) // Max size of body
app.use(bodyParser.urlencoded({
    limit: '512mb',
    extended: true
})) // Max size of body
app.set("port", PORT) // Server uses port
app.use('/api', api) // serve API routes on /api

// Start server and listen on port
try {
    const server = http.listen(PORT) // listen for req on port
    const io = socketio(server) // open socket on server port
    io.on('connection', (socket) => { // Socket connection
        console.log(`New Connection: ${socket.id}`)
        socket.on('ENCRYPT_BY_TEXT', (data) => {
            console.log(data)
        })
        socket.on('ENCRYPT_BY_FILE', (data) => {
            console.log(data)
        })
        socket.on('DECRYPT_BY_TEXT', (data) => {
            console.log(data)
        })
        socket.on('DECRYPT_BY_FILE', (data) => {
            console.log(data)
        })
    })
    console.log(`Listening on port: ${PORT}`)
} catch (e) {
    // Oh No! Something went wrong!
    console.error(`\n\n[ERROR] An Error has occurred:\n${e}`)
}
