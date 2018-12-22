"use strict"
let {decrypt} = require(__dirname + '/decryption'),
    {findMonogramSum} = require(__dirname + '/monogram'),
    {findBigramSum} = require(__dirname + '/bigrams'),
    particles = require(__dirname + '/initializePso'),
    friedman = require(__dirname + '/friedman')

// Finds the fitness value of the particular key value through the decrypted text
// Accomplishes this by leveraging the use of Monogram.js and Bigram.js respectively
function findFitness(dtxt) {
    let mSum = findMonogramSum(dtxt, 0.23),
        bSum = findBigramSum(dtxt, .77)
    return mSum + bSum
}

// Allows for the subtraction of two characters, allowing for overflow wraparound using modulus
function subtractChar(chOne, chTwo) {
    return ((((chOne.charCodeAt(0) - 65) - (chTwo.charCodeAt(0) - 65))) % 26)
}

// Updates the velocity of a particle through the use of the PSO algorithm velocity update conditions
function updateVelocity(particle, gBestKey, pBest) {
    for (let i = 0; i < particle.v.length; i++) {
        particle.rand1 = Math.random() * (1 - 0) + 0
        particle.rand2 = Math.random() * (1 - 0) + 0
        particle.v[i] = (Math.floor(particle.w * particle.v[i] + (particle.c1 * particle.r1 * (subtractChar(pBest[i], particle.x[i]))) + (particle.c2 * particle.r2 * (subtractChar(gBestKey[i], particle.x[i])))) % 26)
    }
}

// Only call this function AFTER updating the velocity of a particle
// Updates the position of a particle by applying the velocity of each dimension to the position at that dimension
function updatePosition(particle) {
    let xp = particle.x,
        vel = particle.v
    for (let i = 0; i < xp.length; i++) {
        if (vel[i] < 0) {
            xp[i] = String.fromCharCode((((xp[i].charCodeAt(0) - 65) + vel[i] + 26) % 26) + 65)
        } else {
            xp[i] = String.fromCharCode(((xp[i].charCodeAt(0) - 65) + vel[i]) % 26 + 65)

        }
    }
}

// Updates the global best particle list with the passed new global best particle
function updateGBest(particleLst, gBestNew) {
    for (let i = 0; i < particleLst.length; i++) {
        particleLst[i].gBest = gBestNew
    }
}

// Main driver function responsible for running the PSO algorithm.
// Takes in the encrypted text and number of particles; Returns the suggested key
function psoMain(etxt, numParticles) {
    // Initialization of variables, including generation of particle list
    console.log(friedman.getEstKeyLen(etxt)[0])
    let particleLst = particles.generateParticles(numParticles, friedman.getEstKeyLen(etxt)[0]),
        gBestFitness = 100,
        gBestKey = "",
        prevBest = "",
        tCounter = 0

    // First run: Initializing the global best
    let particle = particleLst[0],
        dtxt = decrypt(etxt, particle.x.join(""))
    particle.fitness = findFitness(dtxt)
    updateGBest(particleLst, particle)
    gBestFitness = findFitness(dtxt)
    gBestKey = particle.x.join("")


    let counter = 0
    // Termination clause should the pseudo-convergance termination clause not catch
    while (counter < 1000) {
        // Drives through the list of the particles on each iteration
        for (let j = 0; j < particleLst.length; j++) {
            // Initializes the specific particle being looked at in this iteration
            let particle = particleLst[j],
                dtxt = "",
                fitness

            // Decrypts the encrypted text using the particle's current key and find's its fitness value
            dtxt = decrypt(etxt, particle.x.join(""))
            fitness = findFitness(dtxt)

            // Checking to see if the particle's current key beats the global best key
            if ((fitness * 1000) < (gBestFitness * 1000)) {
                gBestKey = particle.x.join("")
                gBestFitness = fitness
                updateGBest(particleLst, particle)
            }

            // Checking to see if the current key beats the particle's previous best key
            if (fitness < findFitness(decrypt(etxt, particle.pBest))) {
                particle.pBest = particle.x.join("")
            }

            // Update the velocity and position respectively after the fitness has been tested
            updateVelocity(particle, gBestKey.split(""), particle.pBest.split(""))
            updatePosition(particle)
        }

        // Pseudo-convergance clause if the global best key doesn't change for 50 * keyLength iterations of the while loop
        if (prevBest === gBestKey) {
            tCounter++
            if (tCounter > (gBestKey.length * 50)) {
                return gBestKey
            }
        } else {
            tCounter = 0
        }
        ++counter
        prevBest = gBestKey
    }

    return gBestKey
}

// console.time("pso")
// console.log(psoMain("APPAZBYQUOPAHAHUWTLBLAAKHALWMAVULBOQUOAPHBDWBTKWAPLZDQZMIMHVLVJZFXAMKEVZKQUIUGVBOMYTHVNCHOLBOMLVNTPAO", 100) )
// console.timeEnd("pso")


// for (let i = 0; i < 20; i++) {
//     console.time("pso")
//     console.log(psoMain("IOIKWIYIFKXZAKEBWLWXTZTUEHLOXWDTELLXUGLLPAWGYAKOLLTYWAWTIESRTUCJCEAEVADYDARPUYGXWLRDECNUSKTAHWICNLAWWSAFKJHGWMHHVWVHHTAPTHNVVDIUKXAHNYYPNEUEEHBDIDMMSRNKIXJTYEFXIOIFKHVNWADBLVRDAEPTTJTLSQLTZIRHSWWJJHSW", 100))
//     console.timeEnd("pso")
// }
// 2-Letter Key Encrypted Text (Hi) [100 Chars]
// APPAZBYQUOPAHAHUWTLBLAAKHALWMAVULBOQUOAPHBDWBTKWAPLZDQZMIMHVLVJZFXAMKEVZKQUIUGVBOMYTHVNCHOLBOMLVNTPAO

// 3-Letter Key Encrypted Text (Cat) [150 Chars]
// VHBUSMTIGIILCSTOPEGTXUTVCSXQFLQMXVHBPGMJAMYONNDHVHXTWBUEUGAGGNVTYIVEWYOKFIGCNRQTAGRECNZWAZGTAGEGILBUHECNZWAZGILCVXTSTVIEGAGFRHDULVLTPGNCGXEAICBEGOYCLE

// 5-Letter Key Encrypted Text (Phase) [200 Chars]
// IOIKWIYIFKXZAKEBWLWXTZTUEHLOXWDTELLXUGLLPAWGYAKOLLTYWAWTIESRTUCJCEAEVADYDARPUYGXWLRDECNUSKTAHWICNLAWWSAFKJHGWMHHVWVHHTAPTHNVVDIUKXAHNYYPNEUEEHBDIDMMSRNKIXJTYEFXIOIFKHVNWADBLVRDAEPTTJTLSQLTZIRHSWWJJHSW

// 8-Letter Key Encrypted Text (Cinnamon) [400 Chars]
// VPVFSFFVPOVFAEOZRTRGEEHPCARBFECZGBUVNSHUCBJBUXRBVPREWUGRDMNAEZQEAXGRDICEFQANNKCGJMEYAZUHCORGHQSAITVFHXOAICNTEUGNXMEFAFWYGIAQRAPHUBYNNSINIMPNPMPYGWSZAZMQKNSRRQBGVPVAGECAGEBHLPBBVMKCEOHGQJRGHQQNUMFHCTOFVPVFWQQNPWOFEDJRVPNGTTWFUPBHLPWAEZRNSQHUGZNGENMJJQPUTTSPKXURROOAFMGRCFHUGSRLTTSDWQPXBDCJPNBKJGACGLFJIRHYAWIRRFVRDZNADZSJEIABEFVNVBURPXIZDMEUAPPBWOUGTTSQCGORFAFRYQGUMABRANEBMTWFYQSRSTSUCLJBRWSQJIEQFAFVV

module.exports = function (input, done) {
    done({key: psoMain(input.enc, 100)})
}
