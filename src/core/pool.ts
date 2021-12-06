import {Node, NodeType} from './node'

export class Pool {

	nodes: Map<string, Node> = new Map<string, Node>()

	addNode(type?: NodeType) {
		return new Node(this, type || 'basic')
	}

	delNode(id: string) {
		const delPeer = this.nodes.get(id)
		if (!delPeer) return 'no such peer'
		this.nodes.delete(id)
		return ['removed', delPeer]
	}

	showNodes(id?: string) {
		return id ? this.nodes.get(id) : this.nodes
	}

}