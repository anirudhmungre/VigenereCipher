"use strict"
const {psoMain} = require('./pso')
module.exports = {
    pso: (etxt = '') => {
        let start_time = new Date().getTime()
        let key = psoMain(etxt, 100)
        return {
            runtime: (new Date().getTime()) - start_time,
            key: key
        }
    }
}
