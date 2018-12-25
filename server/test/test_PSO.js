'use strict'
const WorkerNodes = require('worker-nodes')
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
    const pool = new WorkerNodes(resolvePath('pso_thread_pool'), {
        lazyStart: true,
        autoStart: true,
        maxWorkers: 4
    })
    allocatedThreads.push(pool)
    return pool
}

const main = () => {
    const currentTest = 3
    const testCount = 100

    let threadPool = createWorkerThreadPool()
    for (let i = 0; i < testCount; i++) {
        threadPool.call.pso(encrypt(plaintext, testCases[currentTest].correctKey))
            .then(msg => console.log(msg))
            .catch(err => console.error(err))
    }
}

try {
    main()
} catch (e) {
    console.error(e)
}
