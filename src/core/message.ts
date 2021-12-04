import {Transaction} from './transaction'

export type MessageType = 'newTransaction' | 'requestBlocks' | 'requestTransactions' | 'mined'

export interface Message {
	type: MessageType
}

export interface TransactionMessage extends Message {
	transaction: Transaction
}

export interface RequestMessage extends Message {
	limit: number
}
