"use strict"

function decrypt(ptxt, key){
<<<<<<< HEAD
    let etxt = ""
    for (let i = 0 ; i < ptxt.length ; i++){
        etxt += String.fromCharCode((( (ptxt.charCodeAt(i) - 65) - (key.charCodeAt(i%key.length) - 65) + 26) % 26 ) + 65)
    }
    return etxt
=======
    let b = "", i = 0
    key = key.split("")
    return ptxt.replace(/[A-Z]/g, a => {
        b = key[i++ % key.length]
        return String.fromCharCode(((a - 65) + (26 - (b-65))) % 26 + 65)
    })
>>>>>>> 972b9201ac2517151da6b22ec364dfe4fbb400de
}

exports.decrypt = decrypt