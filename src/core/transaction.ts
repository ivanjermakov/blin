import {clone} from '../util/clone'
import {inspect, InspectOptions} from 'util'
import {Address} from './address'

export class Transaction {

	constructor(
		public publicKey: string,
		public signature: string,
		public timestamp: number,
		public from: Address,
		public to: Address,
		public value: number,
		public id?: number
	) {
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return {
			id: this.id,
			signature: this.signature,
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