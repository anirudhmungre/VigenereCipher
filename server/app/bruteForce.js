"use strict"
const fried = require(__dirname + '/friedman.js') // Import the friedman module
const monogram = require(__dirname + '/monogram.js') // Import the monogram module
const bigram = require(__dirname + '/bigrams.js') // Import the bigram module
const decrypt = require(__dirname + '/decryption.js') // Import the decryption module

const toString26 = (num, LETARR) => {
    // Changes decimal base 10 number to letter base 26 number
    let decremented, quotient, remainder
    let result = ''
    if (num < 1) {
        return result
    }
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
    // giving the monogram a weight of 23% and the bigram a weight of 77% gave best results
    return mSum + bSum // Return frequency found
}

const bruteForce = (etxt) => {
    let dtxt, testKey, kLen, start, freq
    const LETARR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") // Create an alphabet array possible key letters
    const KEYLENS = fried.getEstKeyLen(etxt) // Use the friedman analysis to get an array of possible key lengths
    for (let i = 0; i < KEYLENS.length; i++) { // Cycles through all possible key lengths
        kLen = KEYLENS[i] // Sets each key length to a variable
        start = 0 // Creates a starting variable to count through keys
        for (let j = kLen - 1; j >= 0; j--) {
            start += 26 ** j // Create the starting key lengths first decimal number base 10
        }
        testKey = "A".repeat(kLen) // Initialize the first test key as a string of all "A"
        for (let j = start + 1; testKey.length == kLen; j++) { // Cycle through all keys in the specified key length
            dtxt = decrypt.decrypt(etxt, testKey) // Store string to check if decrypted from possible key
            freq = checkDec(dtxt) // Check the monogram and bigram frequency analysis of the decrypted text
            if (freq < 0.5 && freq > 0) { // Termination clause if frequency < 50% found to be most useful from trial and error
                return testKey // If termination clause is correct return the testKey as the answer
            }
            testKey = toString26(j, LETARR) // Change decimal number to base 26 letter number as pseudo key
        }
    }
}

exports.bruteForce = bruteForce
