import {Peer} from './peer'
import {Command} from '../control/repl'

export class Pool {

	peers: Map<string, Peer> = new Map<string, Peer>()

	constructor() {
	}

	handleCommand(command: Command) {
		return ''
	}

}