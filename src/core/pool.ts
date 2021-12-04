import {Peer} from './peer'
import {AddPeerCommand, Command, DelPeerCommand, SendPeerCommand, ShowPeerCommand} from '../control/command'

export class Pool {

	peers: Map<string, Peer> = new Map<string, Peer>()

	handleCommand(command: Command) {
		switch (command.type) {
			case 'unknown': {
				return [command]
			}
			case 'add': {
				const addCommand = command as AddPeerCommand
				const miner = addCommand.args?.[0] || false
				const peer = new Peer(this, miner)
				this.peers.set(peer.id, peer)
				return [peer]
			}
			case 'del': {
				const delCommand = command as DelPeerCommand
				const delPeer = this.peers.get(delCommand.id)
				if (!delPeer) return 'no such peer'
				this.peers.delete(delCommand.id)
				return ['removed', delPeer]
			}
			case 'show': {
				const showCommand = command as ShowPeerCommand
				return [showCommand.id ? this.peers.get(showCommand.id) : this.peers]
			}
			case 'send': {
				const sendCommand = command as SendPeerCommand
				this.peers.get(sendCommand.id)!.broadcast(sendCommand.message)
				return ['sent']
			}
		}
		return ''
	}

}