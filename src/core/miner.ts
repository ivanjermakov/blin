import {Node} from './node'
import {Transaction} from './transaction'
import {Block} from './blockchain'
import {config} from '../control/config'
import {Hash} from './hash'

export class Miner {

	constructor(
		public node: Node
	) {
	}

	mine(utxs: Transaction[], lastBlock: Block): Block {
		const lastTxId = lastBlock.transactions.at(-1)!.id!
		const blockUtxs = utxs
			.slice(0, config.maxTransactionsPerBlock)
			.map((t, i) => {
				t.id = lastTxId + i + 1
				return t
			})
		const txHash = Hash.from(blockUtxs)
		let targetHash
		for (let nonce = 0; ; nonce++) {
			targetHash = Hash.from(txHash.hash + nonce)
			if (targetHash.withLeadingZeroes(config.leadingZeroes)) {
				const block = new Block(
					blockUtxs,
					txHash,
					[],
					Hash.empty(),
					lastBlock.hash,
					undefined,
					new Date().valueOf(),
					{
						minerAddress: this.node.address,
						reward: config.blockReward
					},
					targetHash,
					nonce,
					lastBlock.id! + 1
				)
				block.hash = Hash.from(block.hashable())
				return block
			}
		}
	}

}