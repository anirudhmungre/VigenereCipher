"use strict"
let fried = require("./friedman")
let fs = require("fs")

const getWords = () => {
    let text, words
    text = fs.readFileSync("./dictionaryByFreq5000.txt", "utf-8").toUpperCase()
    words = text.split("\n")
    return words
}

const toString26 = (num, letterArr) => {
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

const shift = (etxt, key) => {
    let dtxt = ""
    let encLet, keyLet, shift
    for (let i = 0; i < etxt.length; i++) {
        encLet = etxt.charCodeAt(i)
        keyLet = key.charCodeAt(i % key.length)
        if ((encLet) - (keyLet - 65) < 65) {
            shift = 91 - Math.abs((encLet - 65) - (keyLet - 65))
            dtxt += String.fromCharCode(shift)
        }
        else { dtxt += String.fromCharCode(encLet - (keyLet - 65)) }
    }
    return dtxt
}

const checkDec = (dtxt, words) => {
    let foundSum = 0
    let ratio = 0.0
    let txtChar = dtxt.length
    for (let i = 0; i < words.length; i++) {
        if (dtxt.search(words[i]) != -1) {
            foundSum += words[i].length
            ratio = foundSum / txtChar
        }
        if (ratio > 0.9) { return true }
    }
    return false
}

const bruteForce = (etxt) => {
    let dtxt, words, letterArr, testKey, keyLens, kLen, start
    letterArr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    keyLens = fried.getEstKeyLen(etxt)
    words = getWords()
    for (let i = 0; i < keyLens.length; i++) {
        kLen = keyLens[i]
        start = 0
        for (let j = kLen - 1; j >= 0; j--) {
            start += 26 ** j
        }
        testKey = "A".repeat(kLen)
        for (let j = start + 1; testKey.length == kLen; j++) {
            dtxt = shift(etxt, testKey)
            if (checkDec(dtxt, words)) {
                console.log("Is this decrypted?\nKey: " + testKey + "\nText: " + dtxt)
                // USER INPUT FOR YES OR NO
                return dtxt
            }
            testKey = toString26(j, letterArr)
        }
    }
}

exports.bruteForce = bruteForce