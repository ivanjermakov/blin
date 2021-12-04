import {Pool} from '../src/core/pool'
import {Node} from '../src/core/node'

const pool = new Pool()

const node = new Node(pool, 'basic')

const transaction = node.createTransaction('abcd', 12)
console.log(transaction)


/*
const data = 'abc'
const key = new NodeRSA().generateKeyPair()
const pubKey = key.exportKey('public')
const sig = key.sign(data).toString('hex')
console.log(sig)

const importKey = new NodeRSA().importKey(pubKey, 'public')
const verified = importKey.verify(data, Buffer.from(sig, 'hex'))
console.log(verified)*/
