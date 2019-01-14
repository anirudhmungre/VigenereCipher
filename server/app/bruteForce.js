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
    let dtxt, testKey, start, freq, lowest, bestKey
    const LETARR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") // Create an alphabet array possible key letters
    const KEYLEN = fried.getEstKeyLen(etxt)[0] // Use the friedman analysis to get an array of possible key lengths
    start = 0 // Creates a starting variable to count through keys
    for (let j = KEYLEN - 1; j >= 0; j--) {
        start += 26 ** j // Create the starting key lengths first decimal number base 10
    }
    testKey = "A".repeat(KEYLEN) // Initialize the first test key as a string of all "A"
    lowest = Infinity
    bestKey = testKey
    for (let j = start + 1; testKey.length == KEYLEN; j++) { // Cycle through all keys in the specified key length
        dtxt = decrypt.decrypt(etxt, testKey) // Store string to check if decrypted from possible key
        freq = checkDec(dtxt) // Check the monogram and bigram frequency analysis of the decrypted text
        if (freq < lowest) { 
            bestKey = testKey
            lowest = freq
        }
        testKey = toString26(j, LETARR) // Change decimal number to base 26 letter number as pseudo key
    }
    return bestKey
}

// console.log(bruteForce("VHBUSMTIGIILCVPVFSFFVPOVFAEOZRTRGEEHPCARBFECZGBUVNSHUCBJBUXRBVPREWUGRDMNAEZQEAXGRDICEFQANNKCGJMEYAZUHCORGHQSAITVFHXOAICNTEUGNXMEFAFWYGIAQRAPHUBYNNSINIMPNPMPYGWSZAZMQKNSRRQBGVPVAGECAGEBHLPBBVMKCEOHGQJRGHQQNUMFHCTOFVPVFWQQNPWOFEDJRVPNGTTWFUPBHLPWAEZRNSQHUGZNGENMJJQPUTTSPKXURROOAFMGRCFHUGSRLTTSDWQPXBDCJPNBKJGACGLFJIRHYAWIRRFVRDZNADZSJEIABEFVNVBURPXIZDMEUAPPBWOUGTTSQCGORFAFRYQGUMABRANEBMTWFYQSRSTSUCLJBRWSQJIEQFAFVVSTOPEGTXUTVCSXQFLQMXVHBPGMJAMYONNDHVHXTWBUEUGAGGNVTYIVEWYOKFIGCNRQTAGRECNZWAZGTAGEGILBUHECNZWAZGILCVXTSTVIEGAGFRHDULVLTPGNCGXEAICBEGOYCLE") )

exports.bruteForce = bruteForce
