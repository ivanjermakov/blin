import {Repl} from './control/repl'
import {Pool} from './core/pool'

const pool = new Pool()
new Repl(pool).start()