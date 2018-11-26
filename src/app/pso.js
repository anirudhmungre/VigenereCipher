"use strict"
let { decrypt } = require('./decryption'),
    { findMonogramSum } = require('./monogram'),
    { findBigramSum } = require('./bigrams'),
    particles = require('./initializePso'),
    friedman = require('./friedman')

function findFitness(dtxt) {
    let mSum = findMonogramSum(dtxt, 0.23),
        bSum = findBigramSum(dtxt, .77)
    return mSum + bSum
}

function subtractChar(chOne, chTwo) {
    return ((((chOne.charCodeAt(0) - 65) - (chTwo.charCodeAt(0) - 65))) % 26)
}

function updateVelocity(particle, gBestKey, pBest) {
    for (let i = 0; i < particle.v.length; i++) {
        particle.rand1 = Math.random() * (1 - 0) + 0
        particle.rand2 = Math.random() * (1 - 0) + 0
        particle.v[i] = (Math.floor(particle.w * particle.v[i] + ( particle.c1 * particle.r1 * (subtractChar(pBest[i], particle.x[i])) ) + ( particle.c2 * particle.r2 * (subtractChar(gBestKey[i], particle.x[i])) )) % 26)
    }
}

// Only call this function AFTER updating the velocity of a particle
function updatePosition(particle) {
    let xp = particle.x,
    vel = particle.v
    for (let i = 0; i < xp.length; i++) {
        if (vel[i] < 0) {
            xp[i] = String.fromCharCode( (((xp[i].charCodeAt(0) - 65)  + vel[i] + 26) % 26) + 65)
        } else {
            xp[i] = String.fromCharCode(((xp[i].charCodeAt(0) - 65) + vel[i]) % 26 + 65)

        }
    }
}

function updateGBest(particleLst, gBestNew) {
    for (let i = 0; i < particleLst.length; i++) {
        particleLst[i].gBest = gBestNew
    }
}

function psoMain(etxt, numParticles) {
    let particleLst = particles.generateParticles(numParticles, friedman.getEstKeyLen(etxt)[0]),
    gBestFitness = 100,
    gBestKey = "",
    prevBest = "",
    tCounter = 0

    console.log(friedman.getEstKeyLen(etxt))

    // First run: Initializing the global best
    let particle = particleLst[0],
        dtxt = decrypt(etxt, particle.x.join(""))
    particle.fitness = findFitness(dtxt)
    updateGBest(particleLst, particle)
    gBestFitness = findFitness(dtxt)
    gBestKey = particle.x.join("")

    // Possible saturation condition... Check the personal best of each of the particles... check to see % of particles with the same best & see if it matches global best.
    let counter = 0
    while (counter < 1000) {
        for (let j = 0; j < particleLst.length; j++) {

            let particle = particleLst[j],
            dtxt = "",
            fitness

            dtxt = decrypt(etxt, particle.x.join(""))
            fitness = findFitness(dtxt)

            if ((fitness * 1000) < (gBestFitness * 1000)) {
                gBestKey = particle.x.join("")
                gBestFitness = fitness
                updateGBest(particleLst, particle)
            }
            if (fitness < findFitness(decrypt(etxt, particle.pBest))) {
                particle.pBest = particle.x.join("")
            }

            updateVelocity(particle, gBestKey.split(""), particle.pBest.split(""))
            updatePosition(particle)
        }
        if (prevBest === gBestKey) {
            tCounter++
            if(tCounter > 250) {
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

// 2-Letter Key Encrypted Text (Hi) [100 Chars]
// APPAZBYQUOPAHAHUWTLBLAAKHALWMAVULBOQUOAPHBDWBTKWAPLZDQZMIMHVLVJZFXAMKEVZKQUIUGVBOMYTHVNCHOLBOMLVNTPAO

// 3-Letter Key Encrypted Text (Cat) [150 Chars]
// VHBUSMTIGIILCSTOPEGTXUTVCSXQFLQMXVHBPGMJAMYONNDHVHXTWBUEUGAGGNVTYIVEWYOKFIGCNRQTAGRECNZWAZGTAGEGILBUHECNZWAZGILCVXTSTVIEGAGFRHDULVLTPGNCGXKTBUAFCZBPG

// 5-Letter Key Encrypted Text (Phase) [200 Chars]
//IOIKWIYIFKXZAKEBWLWXTZTUEHLOXWDTELLXUGLLPAWGYAKOLLTYWAWTIESRTUCJCEAEVADYDARPUYGXWLRDECNUSKTAHWICNLAWWSAFKJHGWMHHVWVHHTAPTHNVVDIUKXAHNYYPNEUEEHBDIDMMSRNKIXJTYEFXIOIFKHVNWADBLVRDAEPTTJTLSQLTZIRHSWWJJHSW

// 8-Letter Key Encrypted Text (Cinnamon) [300 Chars]
// VPVFSFFVPOVFAEOZRTRGEEHPCARBFECZGBUVNSHUCBJBUXRBVPREWUGRDMNAEZQEAXGRDICEFQANNKCGJMEYAZUHCORGHQSAITVFHXOAICNTEUGNXMEFAFWYGIAQRAPHUBYNNSINIMPNPMPYGWSZAZMQKNSRRQBGVPVAGECAGEBHLPBBVMKCEOHGQJRGHQQNUMFHCTOFVPVFWQQNPWOFEDJRVPNGTTWFUPBHLPWAEZRNSQHUGZNGENMJJQPUTTSPKXURROOAFMGRCFHUGSRLTTSDWQPXBDCJPNBKJGACGL

module.exports = function (input, done) {
    done({key: psoMain(input.enc, 100)})
}
