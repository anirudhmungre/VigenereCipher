var express = require('express')
var router = express.Router()

router.get("/", (req, res) => {
    res.render("index", {
        title: "Index"
    })
})

router.get("/encrypt", (req, res) => {
    res.render("encrypt", {
        title: "Encrypt String or File"
    })
})

router.get("/decrypt", (req, res) => {
    res.render("decrypt", {
        title: "Decrypt knowing key"
    })
})

router.get("/do-decrypt", (req, res) => {
    res.render("decrypt", {
        title: "Decrypt knowing key"
    })
})

router.get("/decrypt-bruteforce", (req, res) => {
    res.render("decryptbruteforce", {
        title: "Decrypt Bruteforce"
    })
})

router.get("/decrypt-pso", (req, res) => {
    res.render("decryptpso", {
        title: "Decrypt PSO"
    })
})

module.exports = router