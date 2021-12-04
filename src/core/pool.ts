import {Peer} from './peer'
import {AddPeerCommand, Command, DelPeerCommand, SendPeerCommand, ShowPeerCommand} from '../control/command'
import {Message} from './message'

export class Pool {

	peers: Map<string, Peer> = new Map<string, Peer>()

	constructor() {
	}

	handleCommand(command: Command) {
		switch (command.type) {
			case 'add': {
				const addCommand = command as AddPeerCommand
				const peer = new Peer()
				this.peers.set(peer.id, peer)
				return [peer]
			}
			case 'show': {
				const showCommand = command as ShowPeerCommand
				return [showCommand.id ? this.peers.get(showCommand.id) : this.peers]
			}
			case 'del': {
				const delCommand = command as DelPeerCommand
				const delPeer = this.peers.get(delCommand.id)
				if (!delPeer) return 'no such peer'
				this.peers.delete(delCommand.id)
				return ['removed', delPeer]
			}
			case 'send': {
				const sendCommand = command as SendPeerCommand
				this.broadcast(this.peers.get(sendCommand.id)!, sendCommand.message)
				return ['sent']
			}
		}
		return ''
	}

	broadcast<T>(peer: Peer, message: Message) {
		Array.from(this.peers.values())
			.filter(p => p.id !== peer.id)
			.forEach(p => p.receive(message))
	}

}