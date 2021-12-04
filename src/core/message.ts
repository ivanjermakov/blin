export interface Message {
	type: 'newTransaction' | 'requestBlocks' | 'requestTransactions' | 'mined'
	data: any
}