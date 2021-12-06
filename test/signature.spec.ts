import keypair from 'keypair'
import {sign, verify} from '../src/util/signature'

describe('signature test', () => {

	it('should sign and verify data', () => {
		const data = {some: 'some', num: 14}
		const keys = keypair()
		const sig = sign(data, keys.private)
		const verified = verify(data, keys.public, sig)
		expect(verified).toBeTruthy()
	})

})
