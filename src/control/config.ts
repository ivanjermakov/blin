import * as dotenv from 'dotenv'

export interface Config {
	minTransactionsPerBlock: number
	maxTransactionsPerBlock: number
	leadingZeroes: number
	blockReward: number
}

dotenv.config()
export const config: Config = {
	minTransactionsPerBlock: process.env.MIN_TRANSACTIONS_PER_BLOCK
		? parseInt(process.env.MIN_TRANSACTIONS_PER_BLOCK)
		: 1,
	maxTransactionsPerBlock: process.env.MAX_TRANSACTIONS_PER_BLOCK
		? parseInt(process.env.MAX_TRANSACTIONS_PER_BLOCK)
		: 10,
	leadingZeroes: process.env.LEADING_ZEROES
		? parseInt(process.env.LEADING_ZEROES)
		: 2,
	blockReward: process.env.BLOCK_REWARD
		? parseInt(process.env.BLOCK_REWARD)
		: 1.0
}