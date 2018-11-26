"use strict"
const fried = require(__dirname + '/friedman.js')
const fs = require("fs")
const monogram = require(__dirname + '/monogram.js')
const bigram = require(__dirname + '/bigrams.js')
const decrypt = require(__dirname + '/decryption.js')

const toString26 = (num, LETARR) => {
    let decremented, quotient, remainder
    let result = ''
    if (num < 1) { return result }
    quotient = num, remainder
    while (quotient !== 0) {
        decremented = quotient - 1
        quotient = Math.floor(decremented / 26)
        remainder = decremented % 26
        result = LETARR[remainder] + result
    }
    return result
}

const checkDec = (dtxt) => {
    let mSum = monogram.findMonogramSum(dtxt, 0.23),
        bSum = bigram.findBigramSum(dtxt, .77)
    return mSum + bSum
}

const bruteForce = (etxt) => {
    let dtxt, testKey, kLen, start, freq
    const LETARR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const KEYLENS = fried.getEstKeyLen(etxt)
    for (let i = 0; i < KEYLENS.length; i++) {
        kLen = KEYLENS[i]
        console.log(kLen)
        start = 0
        for (let j = kLen - 1; j >= 0; j--) {
            start += 26 ** j
        }
        testKey = "A".repeat(kLen)
        for (let j = start + 1; testKey.length == kLen; j++) {
            // console.log(testKey)
            dtxt = decrypt.decrypt(etxt, testKey)
            freq = checkDec(dtxt)
            if (freq < 0.5 && freq > 0) {
                console.log("Is this decrypted?\nKey: " + testKey + "\nText: " + dtxt)
                // USER INPUT FOR YES OR NO
                return dtxt
            }
            testKey = toString26(j, LETARR)
        }
    }
}

// console.time("runtime")
// bruteForce("VHBUSMTIGIILCSTOPEGTXUTVCSXQFLQMXVHBPGMJAMYONNDHVHXTWBUEUGAGGNVTYIVEWYOKFIGCNRQTAGRECNZWAZGTAGEGILBUHECNZWAZGILCVXTSTVIEGAGFRHDULVLTPGNCGXKTBUAFCZBPG")
// console.timeEnd("runtime")
exports.bruteForce = bruteForce
