import {Message, MinedMessage, ProvideTransactionsMessage, RequestMessage, TransactionMessage} from './message'
import {Transaction} from './transaction'
import {Pool} from './pool'
import {sha256Hash, sha256Verify} from '../util/hash'
import keypair, {KeypairResults} from 'keypair'
import {sign, verify} from '../util/signature'
import {Block, Blockchain} from './block'
import {Optional} from '../util/optional'
import {inspect, InspectOptions} from 'util'
import {Address} from './address'
import {Id} from './id'

export type NodeType = 'basic' | 'full' | 'miner'

export class Node {

	pool: Pool
	type: NodeType
	id: Id
	key: KeypairResults
	address: Address
	/**
	 * Unconfirmed transactions
	 */
	utxs: Transaction[] = []
	blockchain: Optional<Blockchain> = null

	constructor(pool: Pool, type: NodeType) {
		this.pool = pool
		this.type = type
		this.id = new Id()
		this.key = keypair()
		this.address = new Address(this.key.public)
		this.requestTransactions()
		this.requestBlocks()
	}

	[inspect.custom](depth: number, opts: InspectOptions) {
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
			console.log(`@${this.id}`, `#${transaction.signature.slice(0, 4)}`, 'is valid')
			this.utxs.push(transaction)
		} else {
			console.log(`@${this.id}`, `#${transaction.signature.slice(0, 4)}`, 'is already exists')
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
		const hashV = sha256Verify(block.hashable(), block.hash)
	}

	broadcastTransaction(transaction: Transaction) {
		this.broadcast({
			type: 'newTransaction',
			transaction: transaction
		} as TransactionMessage)
	}

	createTransaction(to: Address, value: number): Transaction {
		const transaction = new Transaction(
			this.key.public,
			'',
			new Date().valueOf(),
			this.address,
			to,
			value
		)
		transaction.signature = sign(transaction, this.key.private)
		return transaction
	}

	verifyTransaction(transaction: Transaction): boolean {
		const sigV = verify(transaction.signable(), transaction.publicKey, transaction.signature)
		const hashV = sha256Hash(transaction.publicKey) === transaction.from.hash
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
		Array.from(this.pool.nodes.values())
			.filter(p => p.id !== this.id)
			.forEach(p => p.receive(message))
	}

}