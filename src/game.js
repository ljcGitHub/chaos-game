import './_libs/adapter/index.js'
import { script } from './core/script.js'
import Game from './core/game.js'

const game = new Game(script)
game.start()
export default game
