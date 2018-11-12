"use strict"

function decrypt(ptxt, key){
    let b = "", i = 0
    key = key.split("")
    return ptxt.replace(/[A-Z]/g, a => {
        b = key[i++ % key.length]
        return String.fromCharCode(((a - 65) + (26 - (b-65))) % 26 + 65)
    })
}

exports.decrypt = decrypt