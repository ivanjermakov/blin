import {createHash} from 'crypto'

export function sha256Hash(data: any): string {
	return createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export function sha256Verify(data: any, hash: string): boolean {
	return sha256Hash(data) === hash
}
