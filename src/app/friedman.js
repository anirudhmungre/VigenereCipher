"use strict"

// Calculates the Index of Coincidence based on the coset given
function calcIC(index, coset) {
    let sum = 0,
        ic = 0,
        N = coset[26]
    for (let i = 0; i < (coset.length - 1); i++) {
        sum += coset[i] * (coset[i] - 1)
    }
    ic = sum / (N * (N - 1))
    return sum / (N * (N - 1))
}

// Calculates the average index of coincidence across all cosets from the estimated key length and encrypted text
function calcAvgIC(eKeyLength, etxt) {
    let sum = 0,
        avgIc = 0
    for (let i = 1; i < (eKeyLength + 1); i++) {
        sum += calcIC(i, buildCoset(i, etxt, eKeyLength))
    }
    avgIc = sum / eKeyLength
    return sum / eKeyLength
}

// Builds coset from the specific offset distance given, the encrypted text and suspected key length
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

// Compares the average index of coincidence against the index of coincidence resembling a solution to get estimated key lengths
function compareAvgIC(avgIC, eKey) {
    let icEnglish = 0.0686
    if (avgIC > 0.055) {
        return eKey
    }
    return -1
}

// Main driver to get the estimated key lengths from the given encrypted text
function getEstKeyLen(etxt) {
    let eKeyLen = []
    for (let i = 0; i < etxt.length; i++) {
        if (compareAvgIC(calcAvgIC(i, etxt), i) != -1) {
            eKeyLen.push(i)
        }
    }
    return eKeyLen
}

exports.getEstKeyLen = getEstKeyLen