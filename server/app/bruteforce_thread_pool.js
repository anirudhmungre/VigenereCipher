"use strict"
const {bruteForce} = require('./bruteForce')
module.exports = {
    bruteForce: (etxt = '') => {
        let start_time = new Date().getTime()
        let key = bruteForce(etxt)
        return {
            runtime: (new Date().getTime()) - start_time,
            key: key
        }
    }
}
