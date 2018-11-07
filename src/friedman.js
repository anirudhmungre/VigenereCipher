"use strict"

function occurrences(etxt){
    let arr=[]
    arr.length = 26; 
    arr.fill(0);
    let letter
    for (let i = 0 ; i<etxt.length ; i++){
        letter = etxt.charCodeAt(i)-65
        arr[letter] += 1
    }
    return arr
}
exports.fried = function(etxt){
    let fried, ko, kr, kp
    let sum = 0
    let occur = occurrences(etxt)
    for (let i = 0; i<occur.length ; i++){
        sum += occur[i] * (occur[i]-1)
    }
    console.log(sum)
    console.log(etxt.length*(etxt.length-1))
    ko = sum/(etxt.length*(etxt.length-1))
    kr = 1/occur.length
    kp = 0.067
    console.log(kp)
    console.log(ko)
    console.log(kr)
    fried = (kp-kr)/(ko-kr)
    return fried
}