import {randomBytes} from 'crypto'
import {Message, MinedMessage, ProvideTransactionsMessage, RequestMessage, TransactionMessage} from './message'
import {signableTransaction, Transaction} from './transaction'
import {Pool} from './pool'
import {sha256Hash, sha256Verify} from '../util/hash'
import keypair, {KeypairResults} from 'keypair'
import {sign, verify} from '../util/signature'
import {Show} from '../util/format'
import {Block, Blockchain, hashableBlock} from './block'
import {Optional} from '../util/optional'

export type NodeType = 'basic' | 'full' | 'miner'

export class Node implements Show {

	pool: Pool
	type: NodeType
	id: string
	key: KeypairResults
	address: string
	/**
	 * Unconfirmed transactions
	 */
	utxs: Transaction[] = []
	blockchain: Optional<Blockchain> = null

	constructor(pool: Pool, type: NodeType) {
		this.pool = pool
		this.type = type
		this.id = randomBytes(2).toString('hex')
		this.key = keypair()
		this.address = sha256Hash(this.key.public)
		this.requestTransactions()
		this.requestBlocks()
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
				this.receiveNewTransaction(transaction)
				break
			case 'requestBlockchain':
				break
			case 'requestTransactions':
				const requestMessage = message as RequestMessage
				this.provideTransactions(requestMessage)
				break
			case 'mined':
				const minedMessage = message as MinedMessage
				this.verifyBlock(minedMessage.block)
				break
		}
	}

	receiveNewTransaction(transaction: Transaction) {
		const verified = this.verifyTransaction(transaction)
		if (verified && !this.utxs.some(t => t.signature !== transaction.signature)) {
			console.log(`@${this.id}`, `#${transaction.signature}`, 'is valid')
			this.utxs.push(transaction)
		} else {
			console.log(`@${this.id}`, `#${transaction.signature}`, 'is already exists')
		}
	}

	provideTransactions(requestMessage: RequestMessage) {
		const provideTxs = requestMessage.since
			? this.utxs.filter(tx => tx.timestamp > requestMessage.since!)
			: this.utxs
		this.broadcast({
			type: 'provideTransactions',
			transactions: provideTxs
		} as ProvideTransactionsMessage)
	}

	verifyBlock(block: Block) {
		const hashV = sha256Verify(hashableBlock(block), block.hash)
	}

	broadcastTransaction(transaction: Transaction) {
		this.broadcast({
			type: 'newTransaction',
			transaction: transaction
		} as TransactionMessage)
	}

	createTransaction(to: string, value: number): Transaction {
		const transaction: Transaction = {
			publicKey: this.key.public,
			signature: '',
			timestamp: new Date().valueOf(),
			from: this.address,
			to: to,
			value: value
		}
		transaction.signature = sign(transaction, this.key.private)
		return transaction
	}

	verifyTransaction(transaction: Transaction): boolean {
		const sigV = verify(signableTransaction(transaction), transaction.publicKey, transaction.signature)
		const hashV = sha256Hash(transaction.publicKey) === transaction.from
		return sigV && hashV
	}

	requestBlocks(since?: number) {
		this.broadcast({
			type: 'requestBlockchain',
			since: since
		} as RequestMessage)
	}

	requestTransactions(since?: number) {
		this.broadcast({
			type: 'requestTransactions',
			since: since
		} as RequestMessage)
	}

	broadcast<T>(message: Message) {
		Array.from(this.pool.peers.values())
			.filter(p => p.id !== this.id)
			.forEach(p => p.receive(message))
	}
}