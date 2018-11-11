"use strict"

function getWords(){
    let fs, text, words
    fs = require("fs")
    text = fs.readFileSync("./dictionaryByFreq5000.txt", "utf-8").toUpperCase()
    words = text.split("\n")
    return words
}

function toString26(num, letterArr) {
    let decremented, quotient, remainder
    let result = ''
    if (num < 1) { return result }
    quotient = num, remainder
    while (quotient !== 0) {
        decremented = quotient - 1
        quotient = Math.floor(decremented / 26)
        remainder = decremented % 26
        result = letterArr[remainder] + result
    }
    return result
}
// for (let i = 0; i < 100; i++){
//     console.log(toString26(i))
// }
function shift(etxt, key) {
    let dtxt = ""
    let encLet, keyLet, shift
    for (let i = 0; i < etxt.length; i++) {
        encLet = etxt.charCodeAt(i)
        keyLet = key.charCodeAt(i % key.length)
        if ((encLet) - (keyLet-65) < 65){
            shift = 91 - Math.abs((encLet-65) - (keyLet-65))
            dtxt += String.fromCharCode(shift)
        }
        else{dtxt += String.fromCharCode(encLet - (keyLet-65))}
    }
    return dtxt
}

function checkDec(dtxt, words){
    let count = 0
    for (let i = 0; i < words.length; i++){
        // console.log("FOUND " + i + ": " + dtxt.search(words[i]))
        if (dtxt.search(words[i])!=-1){
            count++
        }
        if(count >= 3){return true}
    }
    return false
}

function bruteForce(etxt) {
    let dtxt, words, letterArr, testKey, input
    letterArr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    words = getWords()
    testKey = toString26(1, letterArr)
    for (let i = 1; testKey.length <= etxt.length; i++) {
        dtxt = shift(etxt, testKey)
        if (checkDec(dtxt, words)){
            console.log("Is this decrypted?\n" + dtxt)
            // USER INPUT FOR YES OR NO
            if (input = "Y"||"y"){return dtxt}
        }
        testKey = toString26(i, letterArr)
    }

}
bruteForce("COULDTHESEFIRSTCOME")


// exports bruteForce = bruteForce
// WOULD = XPVME
// THE = UIF