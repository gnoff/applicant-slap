let remote = require('./remote')
let game = require('./game')

module.exports = async function app() {
  console.log('starting app')
  try {
    let data = await remote.loadData()
    if (data.length < 2) {
      console.error('game can not be played because there are fewer than 2 players')
    } else {
      try {
        game.play(data)
      } catch (gamesError) {
        console.error('there was a problem playing the game. the process will now exit', gamesError)
      }
    }
  } catch (dataError) {
    console.error('there was a problem loading data for this game. please check that the remote resourse exists and is in the expected format. the process will now exit', dataError)
  }
}
