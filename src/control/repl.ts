import repl from 'repl'
import {Pool} from '../core/pool'
import {Address} from '../core/address'

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
		replServer.context.Address = Address
	}

	showMotd() {
		console.log(`Welcome to Blin ${process.env.npm_package_version}`)
		console.log()
	}

}