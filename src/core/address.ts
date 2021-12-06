import {inspect, InspectOptions} from 'util'
import {sha256Hash} from '../util/hash'
import {randomBytes} from 'crypto'

export class Address {

	hash: string

	constructor(
		key?: string
	) {
		this.hash = sha256Hash(key || randomBytes(16).toString('hex'))
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return '#' + this.hash.slice(0, 4)
	}

}