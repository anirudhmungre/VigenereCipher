"use strict"

let decrypt = require('./decryption.js'),
    monogram = require('./monogram.js'),
    bigram = require('./bigrams.js'),
    particles = require('./initializePso.js'),
    friedman = require('./friedman.js')

function findFitness(dtxt) {
    let mSum = monogram.findMonogramSum(dtxt, 0.23),
        bSum = bigram.findBigramSum(dtxt, .77)
    return mSum + bSum
}

function subtractChar(chOne, chTwo) {
    return ((((chOne.charCodeAt(0) - 65) - (chTwo.charCodeAt(0) - 65)) + 26) % 26)
}

function updateVelocity(particle) {
    particle.rand1 = Math.random() * (1 - 0) + 0
    particle.rand2 = Math.random() * (1 - 0) + 0
    for (let i = 0; i < particle.v.length; i++) {
        particle.v[i] = (Math.floor(particle.w * particle.v[i] + (particle.c1 * particle.r1) * (subtractChar(particle.pBest[i], particle.x[i])) + particle.c2 * particle.r2 * (subtractChar(particle.gBest.x[i], particle.x[i]))))
    }
}

// Only call this function AFTER updating the velocity of a particle
function updatePosition(particle) {
    let xp = particle.x,
        vel = particle.v

    for (let i = 0; i < xp.length; i++) {
        if (vel < 0) {
            xp[i] += String.fromCharCode((((xp[i].charCodeAt(0) - 65) + vel + 26) % 26) + 65)
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
    encryptedFitness = findFitness(etxt),
    gBestFitness = 100,
    gBestKey = ""
    console.log(encryptedFitness)
    console.log(findFitness("HELLOWORLDTHISISASMALLSTRINGTHATWILLBEENCRYPTEDFORTHEPURPOSESOFTHISTESTCASEWEWILLBEOBSERVINGTHEUSEOFFRIEDMANTOSEEIFTHEKEYLENGTHCOMESBACKCORRECTLYWENEEDTOADDMORECHARACTERSFORTHEPURPOSESOFTHISTESTINGSOTHATTHEALGORITHMCOMESBACKMOREEFFECTIVELY"))
    
    
    // First run: Initializing the global best
    let particle = particleLst[0],
        dtxt = decrypt.decrypt(etxt, particle.x.join(""))
    particle.fitness = findFitness(dtxt)
    updateGBest(particleLst, particle)
    gBestFitness = findFitness(dtxt)

    let counter = 0
    while ( /* ((pgBest.fitness - encryptedFitness) < 3.5) || */ counter < 1000) {
        for (let j = 0; j < particleLst.length; j++) {
            let particle = particleLst[j],
            dtxt = "",
            fitness
            
            dtxt = decrypt.decrypt(etxt, particle.x.join(""))
            fitness = findFitness(dtxt)
            
            //console.log(particle.fitness, bstFitVal)
           
            if ((fitness * 1000) < (gBestFitness * 1000)) {
                console.log(fitness, gBestFitness)
                gBestKey = particle.x.join("")
                gBestFitness = fitness
                updateGBest(particleLst, particle)
            }
            if (particle.fitness < findFitness(decrypt.decrypt(etxt, particle.pBest.join("")))) {
                particle.pBest = particle.x
            }

            updateVelocity(particle)
            updatePosition(particle)
        }
        console.log(gBestKey, gBestFitness)
        ++counter
    }

    //return pgBest 
}

//console.log(fitness(decrypt.decrypt("JEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSX", "CAT")))

//console.log(fitness("JEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXJEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSX"))

//console.log(findFitness("JEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXYEPKLEDEHDSXTVBPGMJENUEHHFKKEWOAGVOLGEBHTAGKXALXPGMJCHOELDAVMCHTRXETEA"))
//console.log(findFitness("HELLOWORLDTHISISASMALLSTRINGTHATWILLBEENCRYPTEDFORTHEPURPOSESOFTHISTESTCASEWEWILLBEOBSERVINGTHEUSEOFFRIEDMANTOSEEIFTHEKEYLENGTHCOMESBACKCORRECTLYWENEEDTOADDMORECHARACTERSFORTHEPURPOSESOFTHISTESTINGSOTHATTHEALGORITHMCOMESBACKMOREEFFECTIVELY"))
//let arr2 = ["U", "T", "Z"]
//let dStr = decrypt.decrypt("JEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXYEPKLEDEHDSXTVBPGMJENUEHHFKKEWOAGVOLGEBHTAGKXALXPGMJCHOELDAVMCHTRXETEAWXPEXFTHCDWOOKGCACRTETXTSYQRMJEIWRIQSXUOYVHBUTXUTBPGLQTACTMJETNGHTIMJMVQMXUBTEKFQRXGFYGCMKVXNY", arr2.join(""))
//console.log(findFitness(dStr))

psoMain("JEENOPQREFTAKSBUALOAENSMTIGITACTPKLEDEXPCKAPMGDYQRMJEIWRIQSXUOYVHBUTXUTVCSXYEPKLEDEHDSXTVBPGMJENUEHHFKKEWOAGVOLGEBHTAGKXALXPGMJCHOELDAVMCHTRXETEAWXPEXFTHCDWOOKGCACRTETXTSYQRMJEIWRIQSXUOYVHBUTXUTBPGLQTACTMJETNGHTIMJMVQMXUBTEKFQRXGFYGCMKVXNY", 100)