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
function friedman(etxt, occur){
    let fried, ko, kr, kp
    let sum = 0
    for (let i = 0; i<occur.length ; i++){
        sum += occur[i] * (occur[i]-1)
    }
    ko = sum/(etxt.length*(etxt.length-1))
    kr = 1/occur.length
    kp = 0.067
    fried = (kp-kr)/(ko-kr)
    return fried
}
let etxt = "AERYGOOD"
console.log(friedman(etxt, occurrences(etxt)))