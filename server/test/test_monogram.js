'use strict'

const assert = require('assert')

const {findMonogramSum} = require('../app/monogram')

let testString = 'INCRYPTOGRAPHYPLAINTEXTORCLEARTEXTISUNENCRYPTEDINFORMATIONASOPPOSEDTOINFORMATIONENCRYPTEDFORSTORAGEORTRANSMISSIONPLAINTEXTUSUALLYMEANSUNENCRYPTEDINFORMATIONPENDINGINPUTINTOCRYPTOGRAPHICALGORITHMSUSUALLYENCRYPTIONALGORITHMSCLEARTEXTUSUALLYREFERSTODATATHATISTRANSMITTEDORSTOREDUNENCRYPTEDINTHECLEAR'
let sum = 0.060176081081081086

describe('Monogram', function () {
    describe('findMonogramSum()', function () {
        it('should return monogram component sum of frequencies from the decrypted text', function () {
            assert.deepStrictEqual(findMonogramSum(testString, 0.23), sum)
        })
    })
})
