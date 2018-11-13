"use strict"

function decrypt(ptxt, key){
    let etxt = ""
    for (let i = 0 ; i < ptxt.length ; i++){
        etxt += String.fromCharCode((( (ptxt.charCodeAt(i) - 65) - (key.charCodeAt(i%key.length) - 65) + 26) % 26 ) + 65)
    }
    return etxt
}

exports.decrypt = decrypt