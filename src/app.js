"use strict"
const SOCKET_PORT = 3771
const Express = require("express")
const SocketIO = require('socket.io')
const spawn = require('threads').spawn
const socket_app = Express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const DDoS = require('dddos')
const {cors} = require('./app/components/cors')
const base64 = require('base64url')
const socket_http = require('http').Server(socket_app)
//Include Local API route
const {encrypt} = require('./app/encryption')
const {decrypt} = require('./app/decryption')

String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}

String.prototype.smart = function () {
    return (this.length > 300 ? this.substring(0, 301) : this)
}

// Server setup
socket_app.use(cors())
socket_app.use(new DDoS({
    maxWeight: 5,
    errorData: {
        "response": 429,
        "message": "GEEZ, that\'s a few too many requests... slow down."
    }
}).express())
socket_app.use(helmet()) // Basic NODE security suite
socket_app.use(bodyParser.json({
    limit: '512mb'
})) // Max size of body
socket_app.use(bodyParser.urlencoded({
    limit: '512mb',
    extended: true
})) // Max size of body
socket_app.set("port", SOCKET_PORT) // Server uses port

socket_app.get('/', (req, res) => {
    res.json({msg: "HELLO"})
})

const socket_encrypt = (plainText, key) => {
    key = key.strip()
    plainText = plainText.strip()
    let start_time = new Date().getTime()
    let encrypted = encrypt(plainText, key) // This is a blocking function
    return {
        plainText: plainText,
        enc: encrypted,
        key: key,
        runtime: (new Date().getTime()) - start_time
    }
}

const socket_decrypt = (encryptedText, key) => {
    key = key.strip()
    encryptedText = encryptedText.strip()
    let start_time = new Date().getTime()
    let decrypted = decrypt(encryptedText, key)
    return {
        plainText: decrypted,
        enc: encryptedText,
        key: key,
        runtime: (new Date().getTime()) - start_time
    }
}

const socket_thread_bruteforce = (encryptedText, callback) => {
    encryptedText = encryptedText.strip()
    let start_time = new Date().getTime()
    const thread = spawn('./app/bruteForce.js')
    thread
        .send({enc: encryptedText.smart()})
        .on('message', function (response) {
            callback(
                decrypt(encryptedText, response.key),
                encryptedText,
                response.key,
                (new Date().getTime()) - start_time
            ) // (plaintext, encryptedText, key, runtime)
            thread.kill()
        })
        .on('error', function (error) {
            console.error('Worker errored:', error)
            thread.kill()
        })
        .on('exit', function () {
            console.log('Worker has been terminated.')
        })
}

const socket_thread_pso = (encryptedText, callback) => {
    encryptedText = encryptedText.strip()
    let start_time = new Date().getTime()
    const thread = spawn('./app/pso.js')
    thread
        .send({enc: encryptedText.smart()})
        .on('message', function (response) {
            callback(
                decrypt(encryptedText, response.key),
                encryptedText,
                response.key,
                (new Date().getTime()) - start_time
            ) // (plaintext, encryptedText, key, runtime)
            thread.kill()
        })
        .on('error', function (error) {
            console.error('Worker errored:', error)
            thread.kill()
        })
        .on('exit', function () {
            console.log('Worker has been terminated.')
        })
}

// Start server and listen on port
try {
    const socket_server = socket_http.listen(SOCKET_PORT)
    const io = SocketIO(socket_server) // open socket on server port
    io.origins('*:*')
    io.on('connection', (socket) => { // Socket connection
        console.log(`New Connection: ${socket.id}`)
        socket.on('ENCRYPT_BY_TEXT', (data) => {
            socket.emit("RESULT_ENCRYPT_BY_TEXT",
                socket_encrypt(data.plainText, data.key)
            )
        })
        socket.on('ENCRYPT_BY_FILE', (data) => {
            socket.emit("RESULT_ENCRYPT_BY_FILE",
                socket_encrypt(base64.decode(data.fileBase64.split(',')[1]), data.key)
            )
        })
        socket.on('DECRYPT_BY_TEXT', (data) => {
            socket.emit("RESULT_DECRYPT_BY_TEXT",
                socket_decrypt(data.enc, data.key)
            )
        })
        socket.on('DECRYPT_BY_FILE', (data) => {
            socket.emit("RESULT_DECRYPT_BY_FILE",
                socket_decrypt(base64.decode(data.fileBase64.split(',')[1]), data.key)
            )
        })
        socket.on('DECRYPT_BRUTEFORCE_BY_TEXT', (data) => {
            socket_thread_bruteforce(data.enc,
                (plainText, encryptedText, key, runtime) => {
                    socket.emit("RESULT_DECRYPT_BRUTEFORCE_BY_TEXT", {
                        plainText: plainText,
                        enc: encryptedText,
                        key: key,
                        runtime: runtime
                    })
                })
        })
        socket.on('DECRYPT_BRUTEFORCE_BY_FILE', (data) => {
            socket_thread_bruteforce(base64.decode(data.fileBase64.split(',')[1]),
                (plainText, encryptedText, key, runtime) => {
                    socket.emit("RESULT_DECRYPT_BRUTEFORCE_BY_FILE", {
                        plainText: plainText,
                        enc: encryptedText,
                        key: key,
                        runtime: runtime
                    })
                })
        })
        socket.on('DECRYPT_PSO_BY_TEXT', (data) => {
            socket_thread_pso(data.enc,
                (plainText, encryptedText, key, runtime) => {
                    socket.emit("RESULT_DECRYPT_PSO_BY_TEXT", {
                        plainText: plainText,
                        enc: encryptedText,
                        key: key,
                        runtime: runtime
                    })
                })
        })
        socket.on('DECRYPT_PSO_BY_FILE', (data) => {
            socket_thread_pso(base64.decode(data.fileBase64.split(',')[1]),
                (plainText, encryptedText, key, runtime) => {
                    socket.emit("RESULT_DECRYPT_PSO_BY_FILE", {
                        plainText: plainText,
                        enc: encryptedText,
                        key: key,
                        runtime: runtime
                    })
                })
        })
    })
    console.log(`SOCKET SERVER Listening on port: ${SOCKET_PORT}`)
} catch (e) {
    // Oh No! Something went wrong!
    console.error(`\n\n[ERROR] An Error has occurred:\n${e}`)
}
