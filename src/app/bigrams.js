"use strict"

function findBigrams (dtxt) {
    let arrBigrams = []
    for (let i = 0; i < (dtxt.length -1 ); i++) {
        arrBigrams.push(dtxt.substr(i, 2))
        //arrBigrams.push(dtxt.charAt(i), dtxt.charAt(i + 1))
    }
    return arrBigrams
}

function findOccurences (bigrams) {
    let occurences = {},
    num = 0
    
    for (let i = 0; i < bigrams.length; i++) {
        num = bigrams[i]
        occurences[num] = occurences[num] ? occurences[num] + 1 : 1
    }
}

function buildTopOccurences() {
    const fs = require('fs')
    let arrFreq = fs.readFileSync("../bigramFrequency.txt", "UTF-8").split(',').split('\n')
    return arrFreq
}

console.log(findBigrams("kmspdpvnqohjfxaqmcgeihaumvl"))
console.log(buildTopOccurences())