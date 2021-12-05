import {inspect, InspectOptions} from 'util'
import {sha256Hash} from '../util/hash'
import {randomBytes} from 'crypto'

export class Id {

	id: string

	constructor(
		id?: string
	) {
		this.id = id ? id : sha256Hash(randomBytes(16).toString('hex'))
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return '@' + this.id.slice(0, 4)
	}

}