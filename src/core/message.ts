import {Transaction} from './transaction'
import {Block, Blockchain} from './block'

export type MessageType =
	'newTransaction'
	| 'requestBlockchain'
	| 'provideBlockchain'
	| 'requestTransactions'
	| 'provideTransactions'
	| 'mined'

export interface Message {
	type: MessageType
}

export interface TransactionMessage extends Message {
	transaction: Transaction
}

export interface RequestMessage extends Message {
	since?: number
}

export interface ProvideTransactionsMessage extends Message {
	transactions: Transaction[]
}

export interface ProvideBlockchainMessage extends Message {
	chain: Blockchain
}

export interface MinedMessage extends Message {
	block: Block
}