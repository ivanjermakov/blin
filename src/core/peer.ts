import {randomBytes} from 'crypto'
import {Message} from './message'

export class Peer {

	id: string

	constructor() {
		this.id = randomBytes(2).toString('hex')
	}

	receive<T>(message: Message): void {
		console.log(`@${this.id}`, 'received', message)
	}

}