import {Transaction} from './transaction'
import {clone} from '../util/clone'

export interface Blockchain {
	firstBlock: Block
}

export class Block {

	constructor(
		public id: number,
		public data: Transaction[],
		public prevBlock: Block,
		public nextBlocks: Block[],
		public hash: string,
		public nonce: number,
		public coinbase: Coinbase
	) {
	}

	hashable() {
		const copy = clone(this)
		copy.hash = ''
		return copy
	}
}

interface Coinbase {
	minerId: string
	reward: number
}