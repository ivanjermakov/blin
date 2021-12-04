export interface Block {
	data: string
	prevBlock: Block
	hash: string
	nonce: number
	coinbase: Coinbase
}

interface Coinbase {
	minerId: string
	reward: number
}
