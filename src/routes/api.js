var express = require('express')
var router = express.Router()

// Local requires
const { encrypt } = require('../encryption')

String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}

router.get("/", (req, res) => {
    return res.json({
        "response": 200,
        "message": "Welcome to the home page of the API!"
    })
})

router.post("/do-encrypt", (req, res) => {
    if (req.body.inputMethod) {
        let dataToEncrypt = ""
        if (req.body.inputMethod === 'file') {
            if (Object.keys(req.files).length == 0) {
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

module.exports = router