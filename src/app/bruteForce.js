"use strict"

function charRange(start, stop) {
    var result = new Array()
    var i = start.charCodeAt(0),
        last = stop.charCodeAt(0) + 1
    for (i; i < last; i++) {
        result.push(String.fromCharCode(i))
    }
    return result
}

function toString26(num) {
    let letterArr = charRange('A', 'Z')
    let result = ''
    if (num < 1) {
        return result
    }
    let quotient = num,
        remainder
    while (quotient !== 0) {
        var decremented = quotient - 1
        quotient = Math.floor(decremented / 26)
        remainder = decremented % 26
        result = letterArr[remainder] + result
    }

    return result
}

function shift(etxt, key) {
    let dtxt = ""
    for (let i = 0; i < etxt.length; i++) {
        dtxt += String.fromCharCode((((etxt.charCodeAt(i) - key.charCodeAt(i % key.length)) - 130) % 26) + 65)
    }
    return dtxt
}

function bruteForce(etxt) {
    let testKey, ttxt, dtxt
    for (let i = 0; i < etxt.length; i++) {
        ttxt = etxt
        testKey = toString26(i)
        dtxt = shift(etxt, testKey)
    }
}
console.log(bruteForce(etxt))


exports.bruteForce = bruteForce