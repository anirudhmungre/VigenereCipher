"use strict"

function generateParticles(numParticles, keySize) {
    let particles = [],
    keyStr = [],
    velocity = []
    for (let i = 0; i < numParticles; i++) {
        for (let j = 0; j < keySize; j++) {
            keyStr.push(String.fromCharCode(Math.floor(Math.random() * (25 - 0 + 1)) + 65))
            velocity.push(Math.floor(26 * (Math.random() * (1 - 0) + 0)))
        }
    
        particles[i] = {
            c1: 2.05,
            c2: 2.05,
            w: 0.9,
            x: keyStr,
            v: velocity,
            r1: Math.random() * (1 - 0) + 0,
            r2: Math.random() * (1 - 0) + 0,
            keySize: keySize,
            fitness: 1,
            pBest: keyStr,
            gBest: {}
        }
        keyStr = []
        velocity = []
    }
    return particles
}

exports.generateParticles = generateParticles