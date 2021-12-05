import repl from 'repl'
import {Pool} from '../core/pool'
import {AddNodeCommand, Command, DelNodeCommand, SendMessageCommand, UnknownCommand} from './command'

export class Repl {

	pool: Pool
	help = () => ({
		availableCommands: [
			{help: 'Show this message'},
			{add: 'Add new peer [isMiner]'},
			{del: 'Remove peer <id>'},
			{show: 'Show peers [id]'},
			{send: 'Send new message by peer <id> <type> <data>'},
		]
	})

	constructor(pool: Pool) {
		this.pool = pool
	}

	start() {
		this.showMotd()
		const replServer = repl.start({
			prompt: '> ',
			ignoreUndefined: true
		})
		replServer.context.pool = this.pool
		replServer.context.help = this.help
	}

	showMotd() {
		console.log('Welcome to Blin v1.0.0')
		console.log('Use /help for more information')
		console.log()
	}

	complete(line: string) {
		const commands = '/help /add /show /send'.split(' ')
		const matching = commands.filter(t => t.startsWith(line))
		return [
			line.length ? matching : commands,
			line
		]
	}

	/**
	 * Supported commands:
	 * /send <client id> <function name> [args]
	 * @param command
	 */
	parse(command: string): Command {
		const tokens = command.split(' ')
		const type = tokens[0].slice(1)
		switch (type) {
			case 'help': {
				return {
					type: type,
				} as Command
			}
			case 'add': {
				return {
					type: type,
					args: this.parseArgs(tokens.slice(1))
				} as AddNodeCommand
			}
			case 'del': {
				return {
					type: type,
					id: tokens[1],
					args: this.parseArgs(tokens.slice(1))
				} as DelNodeCommand
			}
			case 'show': {
				return {
					type: type,
					id: tokens[1],
					args: this.parseArgs(tokens.slice(2))
				} as AddNodeCommand
			}
			case 'send': {
				return {
					type: type,
					id: tokens[1],
					message: {
						type: tokens[2],
						data: tokens[3]
					},
					args: this.parseArgs(tokens.slice(4))
				} as SendMessageCommand
			}
			default: {
				return {
					type: 'unknown',
					command: tokens[0]
				} as UnknownCommand
			}
		}
	}

	parseArgs(argTokens: string[]): string[] {
		const args: string[] = []
		let escapedBuffer: string[] = []
		argTokens.forEach(token => {
			if (token.match('^["\'].*$')) {
				escapedBuffer.push(token.slice(1))
			} else if (token.match('.*["\']$')) {
				escapedBuffer.push(token.slice(0, -1))
				args.push(escapedBuffer.join(' '))
				escapedBuffer = []
			} else {
				args.push(token)
			}
		})
		return args
	}

}