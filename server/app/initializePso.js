"use strict"

// Takes in a number of particles and a key size and returns a list of particles generated
function generateParticles(numParticles, keySize) {
    let particles = [],
        keyStr = [],
        velocity = []
    // Driver that runs through and initializes all particles rom numParticles
    for (let i = 0; i < numParticles; i++) {
        // Generates an initial velocity and position
        for (let j = 0; j < keySize; j++) {
            keyStr.push(String.fromCharCode(Math.floor(Math.random() * (25 - 0 + 1)) + 65))
            velocity.push(Math.floor(26 * (Math.random() * (1 - 0) + 0)))
        }
        // Initializes the particle
        particles[i] = {
            c1: 2.05,
            c2: 2.05,
            w: 0.9,
            x: keyStr,
            v: velocity,
            r1: Math.random() * (1 - 0) + 0,
            r2: Math.random() * (1 - 0) + 0,
            keySize: keySize,
            pBest: keyStr.join(""),
            gBest: {}
        }
        keyStr = []
        velocity = []
    }
    return particles
}

exports.generateParticles = generateParticles