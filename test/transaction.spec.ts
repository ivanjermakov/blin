import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'
import {Transaction} from '../src/core/transaction'
import {Hash} from '../src/core/hash'


describe('transaction verification test', () => {

	let pool: Pool
	let node: Node
	let transaction: Transaction

	beforeEach(() => {
		pool = new Pool()
		node = new Node(pool, 'basic')
		transaction = node.createTransaction(Hash.from(), 12)
	})

	it('should verify transaction', () => {
		const recNode = new Node(pool, 'full')

		const verified = recNode.verifyTransaction(transaction)

		expect(verified).toBeTruthy()
	})

	it('should not verify modified transaction', () => {
		const recNode = new Node(pool, 'full')
		transaction.value = 142

		const verified = recNode.verifyTransaction(transaction)

		expect(verified).toBeFalse()
	})

})
