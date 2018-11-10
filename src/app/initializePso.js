"use strict"

function generateParticles(numParticles, keySize) {
    var particles = []
    for (let i = 0; i < numParticles; i++) {
        particles[i] = {
            c1: 2.05,
            c2: 2.05,
            w: 0.9,
            r1: Math.random() * (1 - 0) + 0,
            r2: Math.random() * (1 - 0) + 0,
            keySize: keySize
        }
    }
    return particles
}

console.log(generateParticles(20, 5)[1])