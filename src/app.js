"use strict"
const PORT = 3770
const SOCKET_PORT = 3771
const express = require("express")
const socketio = require('socket.io')
const spawn = require('threads').spawn
const app = express()
const socket_app = express()
const path = require("path")
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')
const base64 = require('base64url')
const http = require("http").Server(app)
const socket_http = require('http').Server(socket_app)
//Include Local API route
const api = require('./app/routes/api')
const {encrypt} = require('./app/encryption')
const {decrypt} = require('./app/decryption')
const {PSO} = require('./app/pso')

String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}
//Serve static files from public (VUE front-end)
app.use(express.static(path.join(__dirname, "app", "public")))
// Server setup
app.use(fileUpload()) // Allow file-upload to server
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

socket_app.get('/', (req, res) => {
    res.json({msg: "HELLO"})
})

// Start server and listen on port
try {
    const server = http.listen(PORT) // listen for req on port
    const socket_server = socket_http.listen(SOCKET_PORT)
    const io = socketio(socket_server) // open socket on server port
    io.origins('*:*')
    io.on('connection', (socket) => { // Socket connection
        console.log(`New Connection: ${socket.id}`)
        socket.on('ENCRYPT_BY_TEXT', (data) => {
            let key = data.key.strip()
            let plainText = data.plainText.strip()
            let start_time = new Date().getTime()
            let encrypted = encrypt(plainText, key)
            let runtime = (new Date().getTime()) - start_time
            socket.emit("RESULT_ENCRYPT_BY_TEXT", {
                plainText: plainText,
                enc: encrypted,
                key: key,
                runtime: runtime
            })
        })
        socket.on('ENCRYPT_BY_FILE', (data) => {
            let key = data.key.strip()
            let fileData = base64.decode(data.fileBase64.split(',')[1])
            let plainText = fileData.strip()
            let start_time = new Date().getTime()
            let encrypted = encrypt(plainText, key)
            let runtime = (new Date().getTime()) - start_time
            socket.emit("RESULT_ENCRYPT_BY_FILE", {
                plainText: plainText,
                enc: encrypted,
                key: key,
                runtime: runtime
            })
        })
        socket.on('DECRYPT_BY_TEXT', (data) => {
            let key = data.key.strip()
            let enc = data.enc.strip()
            let start_time = new Date().getTime()
            let decrypted = decrypt(enc, key)
            let runtime = (new Date().getTime()) - start_time
            socket.emit("RESULT_DECRYPT_BY_TEXT", {
                plainText: decrypted,
                enc: enc,
                key: key,
                runtime: runtime
            })
        })
        socket.on('DECRYPT_BY_FILE', (data) => {
            let key = data.key.strip()
            let fileData = base64.decode(data.fileBase64.split(',')[1])
            let enc = fileData.strip()
            let start_time = new Date().getTime()
            let decrypted = decrypt(enc, key)
            let runtime = (new Date().getTime()) - start_time
            socket.emit("RESULT_DECRYPT_BY_FILE", {
                plainText: decrypted,
                enc: enc,
                key: key,
                runtime: runtime
            })
        })
        socket.on('DECRYPT_BRUTEFORCE_BY_TEXT', (data) => {
            let enc = data.enc.strip()
            let start_time = new Date().getTime()
            const thread = spawn('./app/bruteForce.js')
            thread
                .send({enc: enc})
                .on('message', function (response) {
                    let runtime = (new Date().getTime()) - start_time
                    socket.emit("RESULT_DECRYPT_BRUTEFORCE_BY_TEXT", {
                        plainText: decrypt(enc, response.key),
                        enc: enc,
                        key: response.key,
                        runtime: runtime
                    })
                    thread.kill()
                })
                .on('error', function (error) {
                    console.error('Worker errored:', error)
                })
                .on('exit', function () {
                    console.log('Worker has been terminated.')
                })
        })
        socket.on('DECRYPT_BRUTEFORCE_BY_FILE', (data) => {
            let fileData = base64.decode(data.fileBase64.split(',')[1])
            let enc = fileData.strip()
            let start_time = new Date().getTime()
            let key = PSO(enc, 100)
            let runtime = (new Date().getTime()) - start_time
            socket.emit("RESULT_DECRYPT_BRUTEFORCE_BY_FILE", {
                plainText: decrypt(enc, key),
                enc: enc,
                key: key,
                runtime: runtime
            })
        })
        socket.on('DECRYPT_PSO_BY_TEXT', (data) => {
            let enc = data.enc.strip()
            let start_time = new Date().getTime()
            const thread = spawn('./app/pso.js')
            thread
                .send({enc: enc})
                .on('message', function (response) {
                    let runtime = (new Date().getTime()) - start_time
                    socket.emit("RESULT_DECRYPT_PSO_BY_TEXT", {
                        plainText: decrypt(enc, response.key),
                        enc: enc,
                        key: response.key,
                        runtime: runtime
                    })
                    thread.kill()
                })
                .on('error', function (error) {
                    console.error('Worker errored:', error)
                })
                .on('exit', function () {
                    console.log('Worker has been terminated.')
                })
        })
        socket.on('DECRYPT_PSO_BY_FILE', (data) => {
            let fileData = base64.decode(data.fileBase64.split(',')[1])
            let enc = fileData.strip()
            let start_time = new Date().getTime()
            const thread = spawn('./app/pso.js')
            thread
                .send({enc: enc})
                .on('message', function (response) {
                    let runtime = (new Date().getTime()) - start_time
                    socket.emit("RESULT_DECRYPT_PSO_BY_FILE", {
                        plainText: decrypt(enc, response.key),
                        enc: enc,
                        key: response.key,
                        runtime: runtime
                    })
                    thread.kill()
                })
                .on('error', function (error) {
                    console.error('Worker errored:', error)
                })
                .on('exit', function () {
                    console.log('Worker has been terminated.')
                })
        })
    })
    console.log(`FILE SERVER Listening on port: ${PORT}`)
    console.log(`SOCKET SERVER Listening on port: ${SOCKET_PORT}`)
} catch (e) {
    // Oh No! Something went wrong!
    console.error(`\n\n[ERROR] An Error has occurred:\n${e}`)
}
