"use strict"

function readFrequency() {
    const fs = require("fs")
    let arrFreq = fs.readFileSync("../CharOccurences.txt", "UTF-8").split('\n')
}