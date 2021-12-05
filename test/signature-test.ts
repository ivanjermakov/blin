import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'
import {Transaction} from '../src/core/transaction'


describe('transaction verification test', () => {

	let pool: Pool
	let node: Node
	let transaction: Transaction

	beforeAll(() => {
		pool = new Pool()
		node = new Node(pool, 'basic')
		transaction = node.createTransaction('abcd', 12)
	})

	it('should verify transaction', () => {
		const recNode = new Node(pool, 'full')
		const verified = recNode.verifyTransaction(transaction)
		expect(verified).toBeTruthy()
	})

})