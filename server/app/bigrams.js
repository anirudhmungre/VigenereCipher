"use strict"
const fs = require('fs')
const fileData = fs.readFileSync(__dirname + '/tst.txt', 'utf-8')

// Finds all possible bigrams from a decrypted text string and returns them in a list
function findBigrams(dtxt) {
    let arrBigrams = []
    for (let i = 0; i < (dtxt.length - 1); i++) {
        arrBigrams.push(dtxt.substr(i, 2))
    }
    return arrBigrams
}

// Builds a key value pair set corresponding to all the bigrams and their frequencies in the English language
function buildTopOccurences() {
    let arrFreq = fileData.split('\n').map(function (sp) {
        return sp.split(' ')
    })
    let tOccurences = {}
    for (let i = 0; i < arrFreq.length; i++) {
        if (!tOccurences[arrFreq[i][0]]) {
            tOccurences[arrFreq[i][0]] = (Number(arrFreq[i][1]) / 4324127906)
        }
    }
    return tOccurences
}

// Finds the bigram component sum of frequencies from the given decrypted text
function findBigramSum(dtxt, w) {
    let bigrams = findBigrams(dtxt),
        mOccurences = {},
        numEntries = 0,
        tOccurences = buildTopOccurences(),
        sum = 0

    for (let i = 0; i < bigrams.length; i++) {
        if (!mOccurences[bigrams[i]]) {
            mOccurences[bigrams[i]] = 0
        }
        ++mOccurences[bigrams[i]]
        ++numEntries
    }

    for (let j of Object.keys(tOccurences)) {
        if (mOccurences[j]) {
            sum += Math.abs((tOccurences[j] - (mOccurences[j] / numEntries)))
        }
    }

    sum *= w
    return sum
}

exports.findBigramSum = findBigramSum
