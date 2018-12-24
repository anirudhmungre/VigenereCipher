'use strict'
const ProgressBar = require("./progress");
const {psoMain} = require('../app/pso')
const {encrypt} = require('../app/encryption')
const fs = require('fs')
// String prototype for regex stripping
String.prototype.strip = function () {
    return this.replace(/[^a-zA-Z]/g, "").toUpperCase()
}
// String prototype for returning 300 chars
String.prototype.smart = function () {
    return (this.length > 300 ? this.substring(0, 301) : this)
}
console.log(`Loading file data...`)
const plaintext = fs.readFileSync('./AliceInWonderland.txt', 'utf-8').strip().smart()
console.log(`File data Loaded.`)

const testCases = [
    {correctKey: 'M'},
    {correctKey: 'ME'},
    {correctKey: 'MOP'},
    {correctKey: 'MOAT'},
    {correctKey: 'MEALS'},
    {correctKey: 'MAPPED'},
    {correctKey: 'MACHINE'},
    {correctKey: 'MAGAZINE'},
    {correctKey: 'MISMARKED'},
    {correctKey: 'MAINTAINED'},
    {correctKey: 'MAGNIFICENT'},
    {correctKey: 'METALLURGIST'},
    {correctKey: 'METAMORPHOSIS'},
    {correctKey: 'MICROPROCESSOR'},
    {correctKey: 'MINIATURIZATION'},
]

let finalResultTable = []

const main = () => {
    const currentTest = 1
    const testCount = 4
    let LCF = Array(testCases[currentTest].correctKey.length).fill(0)
    let testResultTable = []
    const bar = new ProgressBar()
    console.log(`Running Test Suite \nfor: ${testCases[currentTest].correctKey} \nlength: ${testCases[currentTest].correctKey.length} \niterations: ${testCount}\n`)
    bar.init(testCount)
    for (let i = 0; i < testCount; i++) {
        bar.update(i)
        let start_time = new Date().getTime()
        let key = psoMain(
            encrypt(
                plaintext,
                testCases[currentTest].correctKey.strip()
            ),
            100)
        let total = 0
        for (let i = 0; i < testCases[currentTest].correctKey.length; i++) {
            if (testCases[currentTest].correctKey[i] === key[i]) {
                LCF[i]++
                total++
            }
        }
        testResultTable.push({
            actualKey: testCases[currentTest].correctKey,
            guessedKey: key,
            correctness: '' + ((total / testCases[currentTest].correctKey.length) * 100).toFixed(2) + '%',
            correctCount: total,
            runtime: (new Date().getTime()) - start_time
        })
    }
    bar.update(testCount)
    // Test Data
    console.table(testResultTable)

    // Letter frequency breakdown
    LCF = LCF.map(f => f / testCount)
    let correctFrequency = {}
    for (let i = 0; i < testCases[currentTest].correctKey.length; i++) {
        let letter = testCases[currentTest].correctKey[i]
        correctFrequency[letter + '_' + i] = {correctFrequency: LCF[i].toFixed(2)}
    }
    console.table(correctFrequency)

    // Overall Test Data
    let averageRuntime = 0,
        averageCorrect = 0,
        minimumCorrect = testResultTable[0].correctCount,
        maximumCorrect = testResultTable[0].correctCount,
        standardDeviation,
        stdDevSum = 0

    testResultTable.forEach(function (test) {
        averageRuntime += test.runtime
        averageCorrect += test.correctCount
        if (test.correctCount < minimumCorrect) {
            minimumCorrect = test.correctCount
        } else if (test.correctCount > maximumCorrect) {
            maximumCorrect = test.correctCount
        }
    })
    averageRuntime /= testResultTable.length
    averageCorrect /= testResultTable.length

    // Standard Deviation
    testResultTable.forEach(function (test) {
        stdDevSum += Math.pow((test.correctCount - averageCorrect), 2)
    })
    standardDeviation = Math.sqrt((1.0 / testResultTable.length) * stdDevSum)

    finalResultTable.push({
        "key": testCases[currentTest].correctKey,
        "avgRuntime": averageRuntime.toFixed(2),
        "avgCorrect": averageCorrect.toFixed(2),
        "minCorrect": minimumCorrect.toFixed(2),
        "maxCorrect": maximumCorrect.toFixed(2),
        "stdDev": standardDeviation.toFixed(2)
    })
}

main()
console.table(finalResultTable)
