import {randomBytes} from 'crypto'
import {Message, RequestMessage, TransactionMessage} from './message'
import {Transaction} from './transaction'
import {Pool} from './pool'
import {sha256} from '../util/hash'
import {clone} from '../util/clone'
import keypair, {KeypairResults} from 'keypair'
import {sign, verify} from '../util/signature'
import {Show} from '../util/format'

export type NodeType = 'basic' | 'full' | 'miner'

export class Node implements Show {

	pool: Pool
	type: NodeType
	id: string
	key: KeypairResults
	address: string
	ledger: Transaction[] = []

	constructor(pool: Pool, type: NodeType) {
		this.pool = pool
		this.type = type
		this.id = randomBytes(2).toString('hex')
		this.key = keypair()
		this.address = sha256(this.key.public)
	}

	show(): any {
		return {
			id: this.id,
			type: this.type,
			address: this.address
		}
	}

	receive<T>(message: Message): void {
		console.log(`@${this.id}`, 'received', message)
		switch (message.type) {
			case 'newTransaction':
				const transaction = (message as TransactionMessage).transaction
				const verified = this.verifyTransaction(transaction)
				if (verified && !this.ledger.some(t => t.signature !== transaction.signature)) {
					console.log(`@${this.id}`, `#${transaction.id}`, 'VALID')
				}
				break
			case 'requestBlocks':
				break
			case 'requestTransactions':
				break
			case 'mined':
				break
		}
	}

	createTransaction(to: string, value: number): Transaction {
		const transaction: Transaction = {
			publicKey: this.key.public,
			signature: '',
			from: this.address,
			to: to,
			value: value
		}
		transaction.signature = sign(transaction, this.key.private)
		return transaction
	}

	verifyTransaction(transaction: Transaction): boolean {
		const txNoSig = (tx: Transaction) => {
			const cloned = clone(tx)
			cloned.signature = ''
			return cloned
		}
		const sigV = verify(txNoSig(transaction), transaction.publicKey, transaction.signature)
		const hashV = sha256(transaction.publicKey) === transaction.from
		return sigV && hashV
	}

	requestBlocks(limit: number) {
		this.broadcast({
			type: 'requestBlocks',
			limit: limit
		} as RequestMessage)
	}

	requestTransactions(limit: number) {
		this.broadcast({
			type: 'requestTransactions',
			limit: limit
		} as RequestMessage)
	}

	broadcast<T>(message: Message) {
		Array.from(this.pool.peers.values())
			.filter(p => p.id !== this.id)
			.forEach(p => p.receive(message))
	}
}