"use strict"

function occurrences(etxt) {
    let arr = (new Array(26)).fill(0)
    let letter = 0
    for (let i = 0; i < etxt.length; i++) {
        letter = etxt.charCodeAt(i) - 65
        arr[letter] += 1
    }
    return arr
}

function fried(etxt) {
    let ko, kr, 
    sum = 0, 
    occur = occurrences(etxt) 
    for (let i = 0; i < occur.length; i++) { sum += occur[i] * (occur[i] - 1) }
    ko = sum / (etxt.length * (etxt.length - 1))
    kr = 1 / occur.length
    return (0.067 - kr) / (ko - kr)
}

exports.fried = fried