"use strict"

function enc(ptxt, key){
    let etxt = ""
    for (let i = 0 ; i < ptxt.length ; i++){
        // console.log(ptxt.charCodeAt(i))
        etxt += String.fromCharCode((((ptxt.charCodeAt(i)+key.charCodeAt(i%key.length))-130)%26)+65)
    }
    return etxt
}