"use strict"
const {bruteForce} = require('./bruteForce')
module.exports = function (input, done) {
    done({key: bruteForce(input.enc)})
}
