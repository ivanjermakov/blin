import {Node} from './node'
import {Transaction} from './transaction'
import {Block} from './blockchain'
import {config} from '../control/config'
import {sha256Hash} from '../util/hash'

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
		const txHash = sha256Hash(blockUtxs)
		let targetHash = ''
		for (let nonce = 0; ; nonce++) {
			targetHash = sha256Hash(txHash + nonce)
			if (targetHash.startsWith('0'.repeat(config.leadingZeroes))) {
				const block = new Block(
					blockUtxs,
					txHash,
					[],
					'',
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
				block.hash = sha256Hash(block.hashable())
				return block
			}
		}
	}

}