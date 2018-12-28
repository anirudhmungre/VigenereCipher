const {findMonogramSum} = require(__dirname + '/monogram'),
    {findBigramSum} = require(__dirname + '/bigrams')

class Particle {
    constructor(keyLen) {
        this.keyLen = keyLen
        this.fitness = Infinity
        this.c1 = 2.05
        this.c2 = 2.05
        this.w = 0.9
        this.x = []
        this.v = []
        this.r1 = Math.random() * (1 - 0) + 0
        this.r2 = Math.random() * (1 - 0) + 0
        // this.gBest = {}

        for (let i = 0; i < keyLen; i++) {
            this.x.push(String.fromCharCode(Math.floor(Math.random() * (25 - 0 + 1)) + 65))
            this.v.push(Math.floor(26 * (Math.random() * (1 - 0) + 0)))
        }

        this.bestKey = this.x.join("")
        this.bestFit = this.fitness
    }

    // Finds the fitness value of the particular key value through the decrypted text
    // Accomplishes this by leveraging the use of Monogram.js and Bigram.js respectively
    findFitness(dtxt) {
        this.fitness = findMonogramSum(dtxt, 0.23) + findBigramSum(dtxt, .77)
        if (this.fitness < this.bestFit) {
            this.bestFit = this.fitness
            this.bestKey = this.x.join("")
        }
    }

    update(gBestKey) {
        this.updateVelocity(gBestKey, this.bestKey.split(""))
        this.updatePosition()
    }

    updateVelocity(gBestKey, pBest) {
        for (let i = 0; i < this.keyLen; i++) {
            this.r1 = Math.random() * (1 - 0) + 0
            this.r2 = Math.random() * (1 - 0) + 0
            this.v[i] = Math.floor(this.w * this.v[i] + (this.c1 * this.r1
                * (this.subtractChar(pBest[i], this.x[i])))
                + (this.c2 * this.r2 * (this.subtractChar(gBestKey[i], this.x[i])))) % 26
        }
    }

    updatePosition() {
        for (let i = 0; i < this.keyLen; i++) {
            if (this.v[i] < 0) {
                this.x[i] = String.fromCharCode((((this.x[i].charCodeAt(0) - 65) + this.v[i] + 26) % 26) + 65)
            } else {
                this.x[i] = String.fromCharCode(((this.x[i].charCodeAt(0) - 65) + this.v[i]) % 26 + 65)
            }
        }
    }

    subtractChar(ch0, ch1) {
        return ((((ch0.charCodeAt(0) - 65) - (ch1.charCodeAt(0) - 65))) % 26)
    }
}

module.exports = Particle
