import {Message} from '../core/message'

export type CommandType = 'unknown' | 'help' | 'add' | 'del' | 'show' | 'send'

export interface Command {
	type: CommandType
	args?: any[]
}

export interface UnknownCommand extends Command {
	command: string
}

export interface AddNodeCommand extends Command {
}

export interface DelNodeCommand extends Command {
	id: string
}

export interface ShowNodeCommand extends Command {
	id?: string
}

export interface SendMessageCommand extends Command {
	id: string
	message: Message
}
