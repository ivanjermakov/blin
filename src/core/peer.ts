import {randomBytes} from 'crypto'
import {Message} from './message'
import {Transaction} from './transaction'
import {Pool} from './pool'

export class Peer {

	pool: Pool
	miner: boolean
	id = randomBytes(2).toString('hex')
	ledger: Transaction[] = []

	constructor(pool: Pool, isMiner: boolean) {
		this.pool = pool
		this.miner = isMiner
	}

	receive<T>(message: Message): void {
		console.log(`@${this.id}`, 'received', message)
	}

	requestBlocks(limit: number) {
		this.broadcast({
			type: 'requestBlocks',
			data: limit
		})
	}

	requestTransactions(limit: number) {
		this.broadcast({
			type: 'requestTransactions',
			data: limit
		})
	}

	broadcast<T>(message: Message) {
		Array.from(this.pool.peers.values())
			.filter(p => p.id !== this.id)
			.forEach(p => p.receive(message))
	}

}