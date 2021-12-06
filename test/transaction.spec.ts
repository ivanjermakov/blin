import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'
import {Transaction} from '../src/core/transaction'
import {Address} from '../src/core/address'


describe('transaction verification test', () => {

	let pool: Pool
	let node: Node
	let transaction: Transaction

	beforeEach(() => {
		pool = new Pool()
		node = new Node(pool, 'basic')
		transaction = node.createTransaction(new Address(), 12)
	})

	it('should verify transaction', () => {
		const recNode = new Node(pool, 'full')
		const verified = recNode.verifyTransaction(transaction)
		expect(verified).toBeTruthy()
	})

	it('should not verify modified transaction', () => {
		transaction.value = 142

		const recNode = new Node(pool, 'full')
		const verified = recNode.verifyTransaction(transaction)
		expect(verified).toBeFalse()
	})

})
