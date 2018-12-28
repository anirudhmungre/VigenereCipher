'use strict'
const currentTest = 3
const testCount = 100

const WorkerNodes = require('worker-nodes')
const ProgressBar = require("./progress");
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

const resolvePath = name => require.resolve('../app/' + name)

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

const allocatedThreads = []
const createWorkerThreadPool = () => {
    const pool = new WorkerNodes(resolvePath('bruteforce_thread_pool'), {
        lazyStart: true,
        autoStart: true,
        maxWorkers: 10
    })
    allocatedThreads.push(pool)
    return pool
}

const bar = new ProgressBar()
bar.init(testCount)
let iterationCount = 0
let LCF = Array(testCases[currentTest].correctKey.length).fill(0)
let testResultTable = []

const iterationComplete = (data) => {
    let total = 0
    for (let i = 0; i < testCases[currentTest].correctKey.length; i++) {
        if (testCases[currentTest].correctKey[i] === data.key[i]) {
            LCF[i]++
            total++
        }
    }
    testResultTable.push({
        actualKey: testCases[currentTest].correctKey,
        guessedKey: data.key,
        correctness: '' + ((total / testCases[currentTest].correctKey.length) * 100).toFixed(2) + '%',
        correctCount: total,
        runtime: data.runtime
    })
    iterationCount++
    bar.update(iterationCount)
    if (iterationCount >= testCount) {
        console.table(testResultTable)
        LCF = LCF.map(f => f / testCount)
        let correctFrequency = {}
        for (let i = 0; i < testCases[currentTest].correctKey.length; i++) {
            let letter = testCases[currentTest].correctKey[i]
            correctFrequency[letter + '_' + i] = {correctFrequency: LCF[i].toFixed(2)}
        }
        console.table(correctFrequency)
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

        console.table({
            "key": testCases[currentTest].correctKey,
            "avgRuntime": averageRuntime.toFixed(2),
            "avgCorrect": averageCorrect.toFixed(2),
            "minCorrect": minimumCorrect.toFixed(2),
            "maxCorrect": maximumCorrect.toFixed(2),
            "stdDev": standardDeviation.toFixed(2)
        })
    }
}

const main = () => {
    let threadPool = createWorkerThreadPool()
    for (let i = 0; i < testCount; i++) {
        threadPool.call.bruteForce(encrypt(plaintext, testCases[currentTest].correctKey))
            .then(msg => iterationComplete(msg))
            .catch(err => console.error(err))
    }
}

try {
    main()
} catch (e) {
    console.error(e)
}
