import repl from 'repl'
import {Pool} from '../core/pool'
import {AddPeerCommand, Command, DelPeerCommand, SendPeerCommand, UnknownCommand} from './command'
import {Message} from '../core/message'

export class Repl {

	pool: Pool

	constructor(pool: Pool) {
		this.pool = pool
	}

	start() {
		repl.start({
			prompt: '> ',
			ignoreUndefined: true,
			completer: (line: string) => this.complete(line),
			eval: (input, context, filename, callback) => {
				input = input.trim()
				if (input === '') {
					callback(null, undefined)
				} else {
					const command = this.parse(input)
					// console.log(command)
					callback(null, this.pool.handleCommand(command))
				}
			}
		})
	}

	complete(line: string) {
		const commands = '/add /show /send'.split(' ')
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
			case 'add': {
				return {
					type: type,
					args: this.parseArgs(tokens.slice(1))
				} as AddPeerCommand
			}
			case 'del': {
				return {
					type: type,
					id: tokens[1],
					args: this.parseArgs(tokens.slice(1))
				} as DelPeerCommand
			}
			case 'show': {
				return {
					type: type,
					id: tokens[1],
					args: this.parseArgs(tokens.slice(2))
				} as AddPeerCommand
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
				} as SendPeerCommand
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