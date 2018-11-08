function maketrix(etxt, kLen){
    let matrix = Array(27).fill().map(() => (Array(kLen).fill(0)))
    return matrix
}

function posOccur (etxt, kLen){
    let occur
    occur = maketrix(etxt, kLen)
    for (let i = 0 ; i<etxt.length ; i++){
        occur[etxt.charCodeAt(i)-65][i%kLen]++
        occur[26][i%kLen]++
    }
    return occur
}

exports.frequency = function(etxt, kLen){
    let freq
    freq = posOccur(etxt, kLen)
    for (let i = 0 ; i < 26 ; i++){
        freq[i] = freq[i].map((x, index) => {return x/freq[26][index]})
    }
    return freq
}