'use strict'

const assert = require('assert')
const {getEstKeyLen} = require('../app/friedman')

let encryptedText = 'BRUKRTLHZVSIACHETMFMXBLHKGDXTVLXQXALNRWGVVQIMIVBGJGKFELBHRSLHTHHLIVMHMFYHVETMMGGXRUKRTLXWJGKLXGKTKWHKXJTGWEBLWAHGTDTBRLXQXMLNEDERQWTGWMGXRUKRTLXWMFYHVETMMGGIIFWBRYBGTMMBRLHVVQIMSYKTTZBVEDZHVAMAQKNLYSEECWGVVQIMMGGTPYHKMLAFWUEXEJMXBLNLYSEECJXYIJLMSVTMELATXALMVSGLQAMMIVHKWLHKIVNGIFVKCHMXHAGMLWVEISK'

describe('Friedman', function () {
    describe('getEstKeyLen()', function () {
        it('should return array of possible key lengths of encrypted text', function () {
            assert.deepStrictEqual(getEstKeyLen(encryptedText).shift(), 4)
        })
    })
})
