function maketrix(etxt, kLen){
    let matrix = Array(27).fill().map(() => (Array(kLen).fill(0)))
    return matrix
}

exports.posOccur = function (etxt, kLen){
    let matrix = maketrix(etxt, kLen)
    for (let i = 0 ; i<etxt.length ; i++){
        matrix[etxt.charCodeAt(i)-65][i%kLen] +=1
    }
    return matrix
}