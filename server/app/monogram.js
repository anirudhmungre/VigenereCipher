"use strict"
const fs = require("fs")
const fileData = fs.readFileSync(__dirname + "/CharOccurences.txt", "utf-8")

// Finds all occuring monograms within the decrypted text, returning a list with the number of occurences of each
function findMonograms(dtxt) {
    let arr = (new Array(27)).fill(0),
        letter = 0

    for (let i = 0; i < dtxt.length; i++) {
        letter = dtxt.charCodeAt(i) - 65
        arr[letter] += 1
        arr[26] += 1
    }
    return arr
}

// Finds the frequency of each of the monograms found within the decrypted text
function findFrequencies(dtxt) {
    let arr = findMonograms(dtxt)
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] /= arr[26]
    }
    return arr
}

// Reads all the frequencies of each letter from the English language into an array corresponding in index from A-Z [0-25]
function readFrequency() {
    let arrFreq = fileData.split('\n')
    for (let i = 0; i < arrFreq.length; i++) {
        arrFreq[i] = Number(arrFreq[i]) / 100
    }
    return arrFreq
}

// Finds the monogram component sum of frequencies from the decrypted text
function findMonogramSum(dtxt, w) {
    let mFrequencies = findFrequencies(dtxt),
        sFrequencies = readFrequency(),
        sum = 0

    for (let i = 0; i < mFrequencies.length - 1; i++) {
        if (mFrequencies[i] != 0) {
            sum += Math.abs((sFrequencies[i] - mFrequencies[i]))
        }
    }
    sum *= w
    return sum
}

exports.findMonogramSum = findMonogramSum
