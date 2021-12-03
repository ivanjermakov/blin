import repl from 'repl'
import {Pool} from '../core/pool'

export interface Command {
	type: string
}

export interface UnknownCommand extends Command {
	command: string
}

export interface SendCommand extends Command {
	clientId: string
	method: string
	args: string[]
}

export class Repl {

	pool: Pool
	commands = '/send'.split(' ')

	constructor(pool: Pool) {
		this.pool = pool
	}

	start() {
		repl.start({
			prompt: '> ',
			ignoreUndefined: true,
			completer: (line: string) => {
				const matching = this.commands.filter(t => t.startsWith(line))
				return [
					matching.length ? matching : this.commands,
					matching.length === 0 ? matching[0] : line
				]
			},
			eval: (input, context, filename, callback) => {
				input = input.trim()
				if (input === '') {
					callback(null, undefined)
				} else {
					const command = this.parse(input)
					console.log(command)
					callback(null, this.pool.handleCommand(command))
				}
			}
		})
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
			case 'send': {
				return {
					type: type,
					clientId: tokens[1],
					method: tokens[2],
					args: this.parseArgs(tokens.slice(3))
				} as SendCommand
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