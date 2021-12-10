import keypair from 'keypair'
import {sign, verify} from '../src/util/signature'

describe('signature test', () => {

	it('should sign and verify data', () => {
		const data = {some: 'some', num: 14}
		const keys = keypair({bits: 512})
		const sig = sign(data, keys.private)

		const verified = verify(data, keys.public, sig)

		expect(verified).toBeTrue()
	})

	it('should sign and not verify invalid data', () => {
		const data = {some: 'some', num: 14}
		const keys = keypair({bits: 512})
		const sig = '123'

		const verified = verify(data, keys.public, sig)

		expect(verified).toBeFalse()
	})

})
