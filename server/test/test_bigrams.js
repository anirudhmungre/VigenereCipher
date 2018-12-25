'use strict'

const assert = require('assert')

const {findBigramSum} = require('../app/bigrams')

let testString = 'INCRYPTOGRAPHYPLAINTEXTORCLEARTEXTISUNENCRYPTEDINFORMATIONASOPPOSEDTOINFORMATIONENCRYPTEDFORSTORAGEORTRANSMISSIONPLAINTEXTUSUALLYMEANSUNENCRYPTEDINFORMATIONPENDINGINPUTINTOCRYPTOGRAPHICALGORITHMSUSUALLYENCRYPTIONALGORITHMSCLEARTEXTUSUALLYREFERSTODATATHATISTRANSMITTEDORSTOREDUNENCRYPTEDINTHECLEAR'
let sum = 0.5070576823654914

describe('Bigrams', function () {
    describe('findBigramSum()', function () {
        it('should return bigram component sum of frequencies from the decrypted text', function () {
            assert.deepStrictEqual(findBigramSum(testString, 0.77), sum)
        })
    })
})
