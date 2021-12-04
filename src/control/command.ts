import {Message} from '../core/message'

export interface Command {
	type: 'unknown' | 'help' | 'add' | 'del' | 'show' | 'send'
	args?: any[]
}

export interface UnknownCommand extends Command {
	command: string
}

export interface AddPeerCommand extends Command {
}

export interface DelPeerCommand extends Command {
	id: string
}

export interface ShowPeerCommand extends Command {
	id?: string
}

export interface SendPeerCommand extends Command {
	id: string
	message: Message
}
