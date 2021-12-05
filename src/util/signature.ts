import * as crypto from 'crypto'

export function sign(data: any, privateKey: string): string {
	return crypto.sign('RSA-SHA1', Buffer.from(JSON.stringify(data)), {
		key: privateKey,
	}).toString('hex')
}

export function verify(data: any, publicKey: string, signature: string): boolean {
	return crypto.verify(
		'RSA-SHA1',
		Buffer.from(JSON.stringify(data)),
		{
			key: publicKey,
		},
		Buffer.from(signature, 'hex')
	)
}
