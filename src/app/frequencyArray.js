"use strict"
//FrequencyArray reads the CharOccurences.txt file into an array to later be used by the Brute Force
function readFrequency() {
    //Required by node for file system functions
    const fs = require("fs")
    //Reads the file line by line and places each line result into the array indexes
    let arrFreq = fs.readFileSync("./CharOccurences.txt", "UTF-8").split('\n')
    //Return the frequency array
    return arrFreq
}