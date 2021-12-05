import repl from 'repl'
import {Pool} from '../core/pool'

export class Repl {

	pool: Pool

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
	}

	showMotd() {
		console.log(`Welcome to Blin ${process.env.npm_package_version}`)
		console.log()
	}

}