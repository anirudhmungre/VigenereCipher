var express = require('express')
var router = express.Router()

// Local requires
const { encrypt } = require('../encryption')
const { decrypt } = require('../decryption')
const { PSO } = require('../pso')
// const { bfdecrypt } = require('../bruteForce')
const { fried } = require('../friedman')

String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}

router.get("/", (req, res) => {
    return res.json({
        "response": 200,
        "message": "Welcome to the home page of the API!"
    })
})

router.get("/fried/:text", (req, res) => {
    let txt = req.params.text.strip()
    let fr = fried(txt)
    return res.json({
        "response": 200,
        "fried": fr,
        "text": txt
    })
})

router.post("/do-encrypt", (req, res) => {
    if (req.body.inputMethod) {
        let dataToEncrypt = ""
        if (req.body.inputMethod === 'file') {
            if (Object.keys(req.files).length === 0) {
                return res.json({
                    "ERROR": "No File Uploaded..."
                })
            } else {
                dataToEncrypt = req.files.strFile.data.toString("utf-8").strip()
            }
        } else if (req.body.inputMethod === 'string') {
            dataToEncrypt = req.body.strString.strip()
        } else {
            return res.json({
                "ERROR": "Invalid request... You shouldn't be able to do this!"
            })
        }
        let key = req.body.key.strip()
        let start_time = new Date().getTime()
        let encrypted = encrypt(dataToEncrypt, key)
        let runtime = (new Date().getTime()) - start_time
        return res.json({
            "raw": dataToEncrypt,
            "enc": encrypted,
            "key": key,
            "runtime": runtime
        })
    } else {
        // Something has gone VERY wrong if this happens...
        return res.json({
            "ERROR": "Invalid request... You shouldn't be able to do this!"
        })
    }
})

router.post("/do-decrypt", (req, res) => {
    if (req.body.inputMethod) {
        let dataToDecrypt = ""
        if (req.body.inputMethod === 'file') {
            if (Object.keys(req.files).length === 0) {
                return res.json({
                    "ERROR": "No File Uploaded..."
                })
            } else {
                dataToDecrypt = req.files.strFile.data.toString("utf-8").strip()
            }
        } else if (req.body.inputMethod === 'string') {
            dataToDecrypt = req.body.strString.strip()
        } else {
            return res.json({
                "ERROR": "Invalid request... You shouldn't be able to do this!"
            })
        }
        let key = req.body.key.strip()
        let start_time = new Date().getTime()
        let decrypted = decrypt(dataToDecrypt, key)
        let runtime = (new Date().getTime()) - start_time
        return res.json({
            "raw": dataToDecrypt,
            "dec": decrypted,
            "key": key,
            "runtime": runtime
        })
    } else {
        // Something has gone VERY wrong if this happens...
        return res.json({
            "ERROR": "Invalid request... You shouldn't be able to do this!"
        })
    }
})

router.post("/do-decrypt-brute", (req, res) => {
    if (req.body.inputMethod) {
        let dataToDecrypt = ""
        if (req.body.inputMethod === 'file') {
            if (Object.keys(req.files).length === 0) {
                return res.json({
                    "ERROR": "No File Uploaded..."
                })
            } else {
                dataToDecrypt = req.files.strFile.data.toString("utf-8").strip()
            }
        } else if (req.body.inputMethod === 'string') {
            dataToDecrypt = req.body.strString.strip()
        } else {
            return res.json({
                "ERROR": "Invalid request... You shouldn't be able to do this!"
            })
        }

        let start_time = new Date().getTime()
        let {
            decrypted,
            key
        } = bfdecrypt(dataToDecrypt)
        let runtime = (new Date().getTime()) - start_time

        return res.json({
            "raw": dataToDecrypt,
            "dec": decrypted,
            "key": key,
            "runtime": runtime
        })
    } else {
        // Something has gone VERY wrong if this happens...
        return res.json({
            "ERROR": "Invalid request... You shouldn't be able to do this!"
        })
    }
})

router.post("/do-decrypt-pso", (req, res) => {
    if (req.body.inputMethod) {
        let dataToDecrypt = ""
        if (req.body.inputMethod === 'file') {
            if (Object.keys(req.files).length === 0) {
                return res.json({
                    "ERROR": "No File Uploaded..."
                })
            } else {
                dataToDecrypt = req.files.strFile.data.toString("utf-8").strip()
            }
        } else if (req.body.inputMethod === 'string') {
            dataToDecrypt = req.body.strString.strip()
        } else {
            return res.json({
                "ERROR": "Invalid request... You shouldn't be able to do this!"
            })
        }

        let start_time = new Date().getTime()

        let key = PSO(dataToDecrypt, 100)
        let runtime = (new Date().getTime()) - start_time

        return res.json({
            "raw": dataToDecrypt,
            "dec": decrypt(dataToDecrypt, key),
            "key": key,
            "runtime": runtime
        })
    } else {
        // Something has gone VERY wrong if this happens...
        return res.json({
            "ERROR": "Invalid request... You shouldn't be able to do this!"
        })
    }
})

module.exports = router
