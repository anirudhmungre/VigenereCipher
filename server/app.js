"use strict"
// Socket port
const SOCKET_PORT = 3770
// Requires
const Express = require("express")
const SocketIO = require('socket.io')
const spawn = require('threads').spawn
const bodyParser = require('body-parser')
const helmet = require('helmet')
const DDoS = require('dddos')
const {cors} = require('./app/components/cors')
const base64 = require('base64url')

// Start express server
const socket_app = Express()
const socket_http = require('http').Server(socket_app)

// Include encrypt/decrypt functions
const {encrypt} = require('./app/encryption')
const {decrypt} = require('./app/decryption')

// String prototype for regex stripping
String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}
// String prototype for returning 300 chars
String.prototype.smart = function () {
    return (this.length > 300 ? this.substring(0, 301) : this)
}

// API middleware
socket_app.use(cors()) // enable cors on api reqs
socket_app.use(new DDoS({
    maxWeight: 5,
    errorData: {
        "response": 429,
        "message": "GEEZ, that\'s a few too many requests... slow down."
    }
}).express()) // Block DDOS
socket_app.use(helmet()) // Basic Express security suite
socket_app.use(bodyParser.json({
    limit: '512mb'
})) // extend json body limit
socket_app.use(bodyParser.urlencoded({
    limit: '512mb',
    extended: true
})) // extend url encode body limit
socket_app.set("port", SOCKET_PORT) // Bind server to port

// Basic JSON response for the root
socket_app.get('/', (req, res) => {
    res.json({msg: "HELLO"})
})

// Encryption wrapper for input from socket
const socket_encrypt = (plainText, key) => {
    key = key.strip()
    plainText = plainText.strip()
    let start_time = new Date().getTime()
    let encrypted = encrypt(plainText, key)
    return {
        plainText: plainText,
        enc: encrypted,
        key: key,
        runtime: (new Date().getTime()) - start_time
    }
}

// Decryption wrapper for input from socket
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

// wrapper for creating threads async
const create_thread = (socket, spawnFile, sendData, callback) => {
    const thread = spawn(spawnFile)
    socket.runningThreads.push(thread)
    thread
        .send(sendData)
        .on('message', function (response) {
            callback(response)
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

// Async thread creation for brute force to avoid blocking event loop
const socket_thread_bruteforce = (socket, encryptedText, callback) => {
    encryptedText = encryptedText.strip()
    let start_time = new Date().getTime()
    create_thread(socket, './app/bruteForce_thread.js', {enc: encryptedText.smart()}, function (response) {
        callback(
            decrypt(encryptedText, response.key),
            encryptedText,
            response.key,
            (new Date().getTime()) - start_time
        )
    })
}

// Async thread creation for pso to avoid blocking event loop
const socket_thread_pso = (socket, encryptedText, callback) => {
    encryptedText = encryptedText.strip()
    let start_time = new Date().getTime()
    create_thread(socket, './app/pso_thread.js', {enc: encryptedText.smart()}, function (response) {
        callback(
            decrypt(encryptedText, response.key),
            encryptedText,
            response.key,
            (new Date().getTime()) - start_time
        )
    })
}

// Start server and listen on port
try {
    const socket_server = socket_http.listen(SOCKET_PORT) // Open server on SOCKET_PORT
    const io = SocketIO(socket_server) // set socket io to listen
    io.origins('*:*') // Allow cors with socket io
    io.on('connection', (socket) => { // Main io connection event
        socket.runningThreads = [] // Array of running threads to kill on exit
        console.log(`New Connection: ${socket.id}`) // Logging for connection
        socket.on('disconnect', () => { // Disconnect event
            socket.runningThreads.forEach(th => {
                th.kill()
            })
            socket.runningThreads = []
            console.log(`Disconnect: ${socket.id}`)
        })
        // Handle page change during running pso/brute
        socket.on('STOP_ALL_PROCESS', () => {
            socket.runningThreads.forEach(th => {
                th.kill()
            })
            socket.runningThreads = []
            console.log(`STOP`)
        })
        // Events below define functionality for each page of the app
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
            socket_thread_bruteforce(socket, data.enc,
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
            socket_thread_bruteforce(socket, base64.decode(data.fileBase64.split(',')[1]),
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
            socket_thread_pso(socket, data.enc,
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
            socket_thread_pso(socket, base64.decode(data.fileBase64.split(',')[1]),
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
    // Logging when server is started
    console.log(`SOCKET SERVER Listening on port: ${SOCKET_PORT}`)
} catch (e) {
    // General logging for error handling
    console.error(`\n\n[ERROR] An Error has occurred:\n${e}`)
}

// EOF
