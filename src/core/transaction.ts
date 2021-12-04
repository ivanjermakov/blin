export interface Transaction {
	id?: number
	publicKey: string
	signature: string
	from: string
	to: string
	value: number
}