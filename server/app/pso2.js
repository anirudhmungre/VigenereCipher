"use strict"
const {decrypt} = require(__dirname + '/decryption'),
    friedman = require(__dirname + '/friedman'),
    Particle = require(__dirname + '/particle')

// Main driver function responsible for running the PSO algorithm.
// Takes in the encrypted text and number of particles; Returns the suggested key
function psoMain(etxt, numParticles = 1000) {
    // Initialization of variables, including generation of particle list
    let particles = [],
        gBestFitness,
        gBestKey,
        prevBest = "",
        sameBest = 0

    let keyLen = friedman.getEstKeyLen(etxt)[0]
    for (let i = 0; i < numParticles; i++){
        particles.push(new Particle(keyLen))
    }

    // First run: Initializing the global best
    let dtxt = decrypt(etxt, particles[0].x.join(""))
    particles[0].findFitness(dtxt)
    // updateGBest(particleLst, particle)
    gBestFitness = particles[0].fitness
    gBestKey = particles[0].x.join("")

    let iterations = 1000
    // Termination clause should the pseudo-convergance termination clause not catch
    for (let i = 0; i < iterations; i++) {
        prevBest = gBestKey
        // Drives through the list of the particles on each iteration
        particles.forEach(function (particle) {
            // Initializes the specific particle being looked at in this iteration
            let dtxt, fitness,
                testKey = particle.x.join("")

            // Decrypts the encrypted text using the particle's current key and find's its fitness value
            dtxt = decrypt(etxt, testKey)
            particle.findFitness(dtxt)
            // console.log(particle.fitness + " < " + gBestFitness)
            // Checking to see if the particle's current key beats the global best key
            if ((particle.fitness * 1000) < (gBestFitness * 1000)) {
                gBestFitness = particle.fitness
                gBestKey = testKey
                // updateGBest(particles, particle)
            }
        })

        // Pseudo-convergance clause if the global best key doesn't change for 50 * keyLength iterations of the while loop
        if (prevBest === gBestKey) {
            sameBest++
            if (sameBest > (gBestKey.length * 50)) {
                return gBestKey
            }
        } else {
            sameBest = 0
        }
        // console.log(i + " " + prevBest + " " + gBestKey + " " + (prevBest == gBestKey))
        // Update all particles after calculations for fitness
        particles.forEach(particle => {
            particle.update(gBestKey.split(""))
        }) 
    }
    return gBestKey
}

console.time("pso")
console.log(psoMain("VPVFSFFVPOVFAEOZRTRGEEHPCARBFECZGBUVNSHUCBJBUXRBVPREWUGRDMNAEZQEAXGRDICEFQANNKCGJMEYAZUHCORGHQSAITVFHXOAICNTEUGNXMEFAFWYGIAQRAPHUBYNNSINIMPNPMPYGWSZAZMQKNSRRQBGVPVAGECAGEBHLPBBVMKCEOHGQJRGHQQNUMFHCTOFVPVFWQQNPWOFEDJRVPNGTTWFUPBHLPWAEZRNSQHUGZNGENMJJQPUTTSPKXURROOAFMGRCFHUGSRLTTSDWQPXBDCJPNBKJGACGLFJIRHYAWIRRFVRDZNADZSJEIABEFVNVBURPXIZDMEUAPPBWOUGTTSQCGORFAFRYQGUMABRANEBMTWFYQSRSTSUCLJBRWSQJIEQFAFVV", 100) )
console.timeEnd("pso")


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

// exports.psoMain = psoMain
