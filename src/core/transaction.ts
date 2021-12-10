import {clone} from '../util/clone'
import {inspect, InspectOptions} from 'util'
import {Hash} from './hash'

export class Transaction {

	constructor(
		public publicKey: string,
		public signature: string,
		public timestamp: number,
		public from: Hash,
		public to: Hash,
		public value: number,
		public id?: number
	) {
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return {
			id: this.id,
			signature: '#' + this.signature.slice(0, 4),
			from: this.from,
			to: this.to,
			value: this.value
		}
	}

	signable() {
		const copy = clone(this)
		copy.signature = ''
		return copy
	}

}