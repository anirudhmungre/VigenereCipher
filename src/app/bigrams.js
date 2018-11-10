"use strict"

function findBigrams (dtxt) {
    let arrBigrams = []
    for (let i = 0; i < (dtxt.length -1 ); i++) {
        arrBigrams.push(dtxt.substr(i, 2))
    }
    console.log(arrBigrams)
    return arrBigrams
}

function buildTopOccurences() {
    const fs = require('fs')
    let arrFreq = fs.readFileSync('./bigramFrequency.txt', 'UTF-8').split('\n').map(function(sp){ return sp.split(',')})
    let tOccurences = {}
    for (let i = 0; i < arrFreq.length; i++) {
        if (!tOccurences[ arrFreq[i][0] ]) {
            tOccurences[ arrFreq[i][0]] = Number(arrFreq[i][1])
        }
    }
    return tOccurences
}

function findBigramSum (dtxt, w) {
    let bigrams = findBigrams(dtxt),
    mOccurences = {},
    bg = 0,
    numEntries = 0

    for (let i = 0; i < bigrams.length; i++) {
        if (!mOccurences[ bigrams[i] ]) {
            ++numEntries
            mOccurences[ bigrams[i] ] = 0
        }
        ++mOccurences[ bigrams[i] ]
    }
    let tOccurences = buildTopOccurences(),
    sum = 0
    for (let j of Object.keys(mOccurences)) {
        if (tOccurences[j]) {
            console.log(tOccurences[j], mOccurences[j]/numEntries)
            sum += w * (tOccurences[j] - (mOccurences[j]/numEntries))
        }
    }
    console.log(sum)
}

findBigramSum("thheineran", .77)
findBigramSum("kmspdpvnqohjfxaqmcgeihaumvl", .77)