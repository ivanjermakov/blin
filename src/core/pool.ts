import {Node, NodeType} from './node'
import {Message} from './message'
import {format} from '../util/format'

export class Pool {

	peers: Map<string, Node> = new Map<string, Node>()

	addNode(type?: NodeType) {
		const node = new Node(this, type || 'basic')
		this.peers.set(node.id, node)
		return format([node])
	}

	delNode(id: string) {
		const delPeer = this.peers.get(id)
		if (!delPeer) return 'no such peer'
		this.peers.delete(id)
		return format(['removed', delPeer])
	}

	showNodes(id?: string) {
		return format([id ? this.peers.get(id) : this.peers])
	}

	sendMessage(id: string, message: Message) {
		this.peers.get(id)!.broadcast(message)
		return format(['sent'])
	}

}