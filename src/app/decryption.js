"use strict"
// Function used to encrypt plaintext file using the provided key
function decrypt(ptxt, key){
    //Create a variable responsible for storing the encrypted text
    let etxt = ""
    //Parse through the plaintext
    for (let i = 0 ; i < ptxt.length ; i++){
        // console.log(ptxt.charCodeAt(i)) <-- for debugging
        //Encrypted text will be built by converting both key and plaintext characters to ASCII and then adding both together before being converted back to Alphanumeric characters
        etxt += String.fromCharCode((((ptxt.charCodeAt(i)+key.charCodeAt(i%key.length))-130)%26)+65)
    }
    //Function returns encrypted text
    return etxt
}

exports.decrypt = decrypt