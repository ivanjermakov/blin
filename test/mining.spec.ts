import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'
import {Transaction} from '../src/core/transaction'
import {Address} from '../src/core/address'


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
			senderNode.createTransaction(new Address(), 5),
			senderNode.createTransaction(new Address(), 12)
		]
	})

	it('should mine block', () => {
		transactions.forEach(t => senderNode.broadcastTransaction(t))

		const confirmedTxs = minerNode.blockchain.lastBlock.transactions
		expect(confirmedTxs.length).toEqual(2)
		expect(confirmedTxs).toEqual(senderNode.blockchain.lastBlock.transactions)
	})

})