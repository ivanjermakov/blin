import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'
import {Transaction} from '../src/core/transaction'
import {Hash} from '../src/core/hash'


describe('mining test', () => {

	let pool: Pool
	let senderNode: Node
	let minerNode: Node
	let transactions: Transaction[]

	beforeEach(() => {
		pool = new Pool()
		senderNode = new Node(pool, 'basic')
		minerNode = new Node(pool, 'miner')
		transactions = [
			senderNode.createTransaction(Hash.from(), 5),
			senderNode.createTransaction(Hash.from(), 12)
		]
	})

	it('should mine block', () => {
		transactions.forEach(t => senderNode.broadcastTransaction(t))

		const sentTxs = senderNode.blockchain.lastBlock.transactions
		const confirmedTxs = minerNode.blockchain.lastBlock.transactions
		expect(confirmedTxs.length).toEqual(2)
		expect(confirmedTxs).toEqual(sentTxs)
	})

})