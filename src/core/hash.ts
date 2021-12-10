import {inspect, InspectOptions} from 'util'
import {sha256Hash} from '../util/hash'
import {randomBytes} from 'crypto'

export class Hash {

	constructor(
		public hash: string
	) {
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return '#' + this.hash.slice(0, 4)
	}

	verify(data: any): boolean {
		return Hash.from(data).hash === this.hash
	}

	withLeadingZeroes(n: number): boolean {
		return this.hash.startsWith('0'.repeat(n))
	}

	static zero(): Hash {
		return new Hash('0'.repeat(64))
	}

	static empty(): Hash {
		return new Hash('')
	}

	static from(data?: any): Hash {
		return new Hash(sha256Hash(data || randomBytes(16).toString('hex')))
	}

}