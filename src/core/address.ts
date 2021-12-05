import {inspect, InspectOptions} from 'util'
import {sha256Hash} from '../util/hash'

export class Address {

	hash: string

	constructor(
		key: string
	) {
		this.hash = sha256Hash(key)
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return '#' + this.hash.slice(0, 4)
	}

}