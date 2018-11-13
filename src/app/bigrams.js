"use strict"

function findBigrams (dtxt) {
    let arrBigrams = []
    for (let i = 0; i < (dtxt.length -1 ); i++) {
        arrBigrams.push(dtxt.substr(i, 2))
    }
    return arrBigrams
}

function buildTopOccurences() {
    const fs = require('fs')
    let arrFreq = fs.readFileSync('./tst.txt', 'UTF-8').split('\n').map(function(sp){ return sp.split(' ')})
    let tOccurences = {}
    for (let i = 0; i < arrFreq.length; i++) {
        if (!tOccurences[ arrFreq[i][0] ]) {
            tOccurences[ arrFreq[i][0]] = (Number(arrFreq[i][1]) / 4324127906)
        }
    }
    return tOccurences
}

function findBigramSum (dtxt, w) {
    let bigrams = findBigrams(dtxt),
    mOccurences = {},
    numEntries = 0,
    tOccurences = buildTopOccurences(),
    sum = 0

    for (let i = 0; i < bigrams.length; i++) {
        if (!mOccurences[ bigrams[i] ]) {
            mOccurences[ bigrams[i] ] = 0
        }
        ++mOccurences[ bigrams[i] ]
        ++numEntries
    }
    //console.log(mOccurences, numEntries)
    let counter = 0
    for (let j of Object.keys(tOccurences)) {
        if (mOccurences[j]) {
            sum += Math.abs((tOccurences[j] - (mOccurences[j]/numEntries)))
        } else {
            sum += Math.abs(tOccurences[j])
        }
        //console.log(sum, counter)
        counter++
    }
    //console.log(counter)
    sum *= w
    return sum
}

exports.findBigramSum = findBigramSum