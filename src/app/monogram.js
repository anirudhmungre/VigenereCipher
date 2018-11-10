"use strict"

function findMonograms (dtxt) {
    let arr = (new Array(27)).fill(0),
    letter = 0
    
    for (let i = 0; i < dtxt.length; i++) {
        letter = dtxt.charCodeAt(i) - 65
        arr[letter] += 1
        arr[26] += 1
    }
    return arr
}

function findFrequencies (dtxt) {
    arr = findMonograms(dtxt)
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] /= arr[27]
    }
    return arr
}

function readFrequency() {
    const fs = require("fs")
    let arrFreq = fs.readFileSync("./CharOccurences.txt", "UTF-8").split('\n')
    return arrFreq
}

function findMonogramSum (w) {
    let mFrequencies = findFrequencies(dtxt),
    sFrequencies = readFrequency(),
    sum = 0
    for (let i = 0; i < mFrequencies.length; i++) {
        sum += w * (sFrequencies[i] - mFrequencies[i])
    }
    return sum
}

