'use strict'

const assert = require('assert')
const {generateParticles} = require('../app/initializePso')


describe('PSO Initialization', function () {
    describe('generateParticles()', function () {
        let particleArray = generateParticles(1, 4)
        it('should return array of particles', function () {
            assert.deepStrictEqual(particleArray.length, 1)
        })
        it('should have correct c1', function () {
            assert.deepStrictEqual(particleArray[0].c1, 2.05)
        })
        it('should have correct c2', function () {
            assert.deepStrictEqual(particleArray[0].c2, 2.05)
        })
        it('should have correct gBest', function () {
            assert.deepStrictEqual(particleArray[0].gBest, {})
        })
        it('should have correct keySize', function () {
            assert.deepStrictEqual(particleArray[0].keySize, 4)
        })
        it('should have random pBest', function () {
            assert.deepStrictEqual(particleArray[0].pBest.length, 4)
        })
        it('should have correct w', function () {
            assert.deepStrictEqual(particleArray[0].w, 0.9)
        })
    })
})
