"use strict"

<<<<<<< HEAD
function decrypt(ptxt, key) {
=======
function decrypt(ptxt, key){
>>>>>>> 8821b30711d3a040430c51bfcfeceeec2a732ac6
    let etxt = ""
    for (let i = 0; i < ptxt.length; i++) {
        etxt += String.fromCharCode((((ptxt.charCodeAt(i) - 65) - (key.charCodeAt(i % key.length) - 65) + 26) % 26) + 65)
    }
    return etxt
}

exports.decrypt = decrypt