import {clone} from '../util/clone'

export interface Transaction {
	id?: number
	publicKey: string
	signature: string
	timestamp: number
	from: string
	to: string
	value: number
}

export function signableTransaction(tx: Transaction) {
	const copy = clone(tx)
	copy.signature = ''
	return copy
}