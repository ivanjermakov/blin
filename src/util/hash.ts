import {createHash} from 'crypto'

export function sha256(publicKey: string) {
	return createHash('sha256').update(publicKey).digest('hex')
}
