import {Transaction} from './transaction'
import {clone} from '../util/clone'

export interface Blockchain {
	firstBlock: Block
}

export interface Block {
	id: number
	data: Transaction[]
	prevBlock: Block
	nextBlocks: Block[]
	hash: string
	nonce: number
	coinbase: Coinbase
}

interface Coinbase {
	minerId: string
	reward: number
}

export function hashableBlock(block: Block) {
	const copy = clone(block)
	copy.hash = ''
	return copy
}