"use strict"

function calcIC(index, coset) {
    let sum = 0,
    ic = 0,
    N = coset[26]
    for (let i = 0; i < (coset.length - 1); i++) { sum += coset[i] * (coset[i] - 1) }
    ic = sum / (N * (N - 1))
    return sum / (N * (N - 1))
}

function calcAvgIC(eKeyLength, etxt) {
    let sum = 0,
    avgIc = 0
    for (let i = 1; i < (eKeyLength + 1); i++) {
        sum += calcIC(i, buildCoset(i, etxt, eKeyLength))
    }
    avgIc = sum / eKeyLength
    return sum / eKeyLength
}

function buildCoset(index, etxt, keyLength) {
    let arr = (new Array(27)).fill(0)
    let letter = 0
    for (let i = index; i < etxt.length; i += keyLength) {
        letter = etxt.charCodeAt(i) - 65
        arr[letter] += 1
        arr[26] += 1
    }
    return arr
}

function compareAvgIC (avgIC, eKey) {
    let icEnglish = 0.0686
    if (Math.abs(icEnglish - avgIC) < 0.0095) {
        return eKey
    }
    return -1
}

function getEstKeyLen(etxt) {
    let eKeyLen = []
    for (let i = 0; i < etxt.length; i++) {
        if (compareAvgIC(calcAvgIC(i, etxt), i) != -1) {
            console.log(calcAvgIC(i, etxt))
            eKeyLen.push(i)
        }
    }
    return eKeyLen
}
