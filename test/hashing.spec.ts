import {sha256Hash, sha256Verify} from '../src/util/hash'

describe('hashing test', () => {

	it('should hash and verify data', () => {
		const data = {some: 'some', num: 14}
		const hash = sha256Hash(data)

		const verified = sha256Verify(data, hash)

		expect(verified).toBeTrue()
	})

	it('should hash and verify invalid data', () => {
		const data = {some: 'some', num: 14}
		const hash = '123'

		const verified = sha256Verify(data, hash)

		expect(verified).toBeFalse()
	})

})
