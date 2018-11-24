"use strict"
const fried = require("./friedman")
const fs = require("fs")
const monogram = require('./monogram.js')
const bigram = require('./bigrams.js')

const getWords = () => {
    let text, words
    text = fs.readFileSync("./app/dictionaryByFreq5000.txt", "utf-8").toUpperCase()
    words = text.split("\n")
    return words
}

const toString26 = (num, LETARR) => {
    let decremented, quotient, remainder
    let result = ''
    if (num < 1) { return result }
    quotient = num, remainder
    while (quotient !== 0) {
        decremented = quotient - 1
        quotient = Math.floor(decremented / 26)
        remainder = decremented % 26
        result = LETARR[remainder] + result
    }
    return result
}

const shift = (etxt, key) => {
    let dtxt = ""
    let encLet, keyLet, shift
    for (let i = 0; i < etxt.length; i++) {
        encLet = etxt.charCodeAt(i)
        keyLet = key.charCodeAt(i % key.length)
        if ((encLet) - (keyLet - 65) < 65) {
            shift = 91 - Math.abs((encLet - 65) - (keyLet - 65))
            dtxt += String.fromCharCode(shift)
        }
        else { dtxt += String.fromCharCode(encLet - (keyLet - 65)) }
    }
    return dtxt
}

// const checkDec = (dtxt, DICT) => {
//     let foundSum = 0
//     let ratio = 0.0
//     const txtChar = dtxt.length
//     for (let i = 0; i < DICT.length; i++) {
//         if (dtxt.search(DICT[i]) != -1) {
//             foundSum += DICT[i].length
//             ratio = foundSum / txtChar
//         }
//         if (ratio > 0.95) { return true }
//     }
//     return false
// }

const checkDec = (dtxt) => {
    let mSum = monogram.findMonogramSum(dtxt, 0.23),
        bSum = bigram.findBigramSum(dtxt, .77)
    return mSum + bSum
}

const bruteForce = (etxt) => {
    let dtxt, testKey, kLen, start, freq
    const LETARR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const KEYLENS = fried.getEstKeyLen(etxt)
    // const DICT = getWords()
    for (let i = 0; i < KEYLENS.length; i++) {
        kLen = KEYLENS[i]
        console.log(kLen)
        start = 0
        for (let j = kLen - 1; j >= 0; j--) {
            start += 26 ** j
        }
        testKey = "A".repeat(kLen)
        for (let j = start + 1; testKey.length == kLen; j++) {
            console.log(testKey)
            dtxt = shift(etxt, testKey)
            // if (checkDec(dtxt, DICT)) {
            //     console.log("Is this decrypted?\nKey: " + testKey + "\nText: " + dtxt)
            //     // USER INPUT FOR YES OR NO
            //     return dtxt
            // }
            freq = checkDec(dtxt)
            if (freq < 0.5 && freq > 0) {
                console.log("Is this decrypted?\nKey: " + testKey + "\nText: " + dtxt)
                // USER INPUT FOR YES OR NO
                return dtxt
            }
            testKey = toString26(j, LETARR)
        }
    }
}
console.time("runtime")
bruteForce("HIDNCUKVYRWEQIPYJPPGUVHEBNVCXSJVHMLOFCHCJCPRBTPAIUAJREPJFAPRZZHIZGFZMQXFGXFWLHIMXRCCMFVPRWOYTVCSKCSAGJIELVNXXFSCBSQLEDVCKKGMALZDRQOYPXQGVKIPQFJQYQTDTWAKVMTWZIEUSPDVPWLHIGLLCHCJKWIRWIBWMXKWINJFYIALXJXCFSTVEDZRILKVXRADLSIBOZILRZZHIZGFZSPGEAMLWRIAUOXJXCFSTVEGIVXGLCTEJATTWYVMTRRMITWGFNDRBWIAELVRJXFGIAIUAJREPJFAPNGJIMLYUPXCBLCICTFDOPWCTEQWUPXCERGGFDRHXSHUPXCVUTGCESTVJSEVYYYVTREDZHLAZRGEALVGWCLVCGMVZCKYKTXMQLRGXMXKWMQHIDNCUKVYRWEQIPYVQSMCRAMAWJPHTWEIYPWJXRUGESIPDRCHYDZRIQSUKILLLGIQAELSLVVGPYFUAIUAJREPJFAPRZVBMJDVCRGMDUYJUIJQCVZIMMFTWENLVGMBGNCXFWIPFZAKWSJWRAMAWNPWZWXXRLAEVXMYVIZCJPIMPWUDJQAKIMLYSNLCJJXWRWIDRRZVQELCRCHMXYPZGFXCSRZZCKRGUDSLUVDVROZRIQZVWEBHVTTCVZCXMLYTFMGBWIPKZHXCJNPWPWRSMLYSJXGLYPHLGGXGRMITWMJTDRTWIHERAFCWGFZIELVNWERAJILCMJTSDSSDSILYDYEZKPPGUVLMRZFJXNATIYPWJDVAGEKIPKRIMMFJHSQZVLEQUFCWGVVGMLYZCLCJFLRKAESEQOVAPYKJWIAGLAHDGIILCZFIHYQDPHCZVGJCWCKIPQJAICHPPRBKKJTGVNWIRZVGXFWGAIYKLGIMXDPOGFXPHYAJNGFSZCAMMCSFCOFGXFLYTXPGLQPCGWVIRLZCKSHRCHNATZMLYKWIBSZHMCKNWILKLSHCFCNEUZZIIPSSQMROZILNAEZIWWJGELUCDWCTPWIPLYTVCORHRMLYXREKFKIPQITQYJBPFJWZCXFSKCSPVZSEJATTXFAEZMRKFKIPQDJGFGLISDLYTAYQKDLCSIILCJRQFGLJPCRGZIWCDWDLBWRGSFVVPVGKYPPJTVAERWNWILKYTXF")
console.timeEnd("runtime")
// exports.bruteForce = bruteForce
