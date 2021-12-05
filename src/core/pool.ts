import {Node, NodeType} from './node'

export class Pool {

	nodes: Map<string, Node> = new Map<string, Node>()

	addNode(type?: NodeType) {
		const node = new Node(this, type || 'basic')
		this.nodes.set(node.id.id.slice(0, 4), node)
		return node
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