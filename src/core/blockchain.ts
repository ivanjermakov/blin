import {Transaction} from './transaction'
import {clone} from '../util/clone'
import {Address} from './address'
import {inspect, InspectOptions} from 'util'
import {sort} from '../util/array'
import {Optional} from '../util/optional'

export class Blockchain {

	lastBlock: Block

	constructor(
		public firstBlock: Block,
	) {
		this.lastBlock = this.updateLastBlock()
	}

	static singleBlock(): Blockchain {
		const block = new Block([{id: 0} as any], '0'.repeat(64), [], '0'.repeat(64))
		block.id = 0
		return new Blockchain(
			block
		)
	}

	add(block: Block) {
		const prevBlock = this.findBlock(b => b.hash === block.prevBlockHash)
		if (prevBlock) {
			prevBlock.nextBlocks.push(block)
			this.updateLastBlock()
		} else {
			console.log('no such block', block.prevBlockHash)
		}
	}

	findBlock(predicate: (block: Block) => boolean): Optional<Block> {
		return this._findBlock(predicate, this.lastBlock)
	}

	private _findBlock(predicate: (block: Block) => boolean, block: Block): Optional<Block> {
		if (predicate(block)) return block
		if (!block.prevBlock) return null
		return this._findBlock(predicate, block.prevBlock)
	}

	private updateLastBlock(): Block {
		this.lastBlock = this.getLastBlock(this.firstBlock)[0]
		return this.lastBlock
	}

	private getLastBlock(block: Block, blocksSinceBranch: number = 0): [Block, number] {
		blocksSinceBranch++
		if (block.nextBlocks.length === 0) return [block, blocksSinceBranch]
		return sort(
			block.nextBlocks
				.map(b => this.getLastBlock(b, blocksSinceBranch)),
			([, sinceBranch]) => sinceBranch,
			'desc'
		)[0]
	}
}

export class Block {

	constructor(
		public transactions: Transaction[],
		public txHash: string,
		public nextBlocks: Block[],
		public hash: string,
		public prevBlockHash?: string,
		public prevBlock?: Block,
		public timestamp?: number,
		public coinbase?: Coinbase,
		public targetHash?: string,
		public nonce?: number,
		public id?: number
	) {
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
		return {
			transactions: this.transactions,
			hash: this.hash,
			prevBlockHash: this.prevBlockHash,
			nextBlocks: this.nextBlocks.length,
			nonce: this.nonce,
			id: this.id
		}
	}

	hashable() {
		const copy = clone(this)
		copy.transactions = []
		copy.nextBlocks = []
		copy.hash = ''
		copy.prevBlock = undefined
		return copy
	}
}

interface Coinbase {
	minerAddress: Address
	reward: number
}