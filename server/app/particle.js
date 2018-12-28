class Particle{
    constructor(keySize){
        this.c1 = 2.05
        this.c2 = 2.05
        this.w = 0.9
        this.x = []
        this.v = []
        this.r1 = Math.random() * (1 - 0) + 0
        this.r2 = Math.random() * (1 - 0) + 0
        this.gBest = {}

        for (let i = 0; i < keySize; i++){
            this.x.push(String.fromCharCode(Math.floor(Math.random() * (25 - 0 + 1)) + 65))
            this.v.push(Math.floor(26 * (Math.random() * (1 - 0) + 0)))
        }

        this.pBest = this.x.join("")
    }
}