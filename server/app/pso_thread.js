"use strict"
const {psoMain} = require('./pso')
module.exports = function (input, done) {
    done({key: psoMain(input.enc, 100)})
}
