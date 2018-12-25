"use strict"
const {psoMain} = require('./pso')
module.exports = {
    pso: (etxt = '') => {
        console.log("HELLO FROM", process.pid)
        let start_time = new Date().getTime()
        let key = psoMain(etxt, 100)
        console.log({
            runtime: (new Date().getTime()) - start_time,
            key: key
        })
        // return key
        return {
            runtime: (new Date().getTime()) - start_time,
            key: key
        }
    }
}
