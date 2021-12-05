import repl from 'repl'
import {Pool} from '../core/pool'

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

}