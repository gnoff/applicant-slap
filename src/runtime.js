module.exports = {
  run,
}

async function run(app) {
  keepAliveUntilFinished()
  await app()
  process.exit()
}

// this program was written with promises in mind but because there would otherwise
// be no tasks in any task queue we need to create one here to keep the program
// alive and let the promise's resolve
// i could have syncrhonously loaded the file from a file and avoided this but
// wanted to keep the fetch of the dropbox data in place
function keepAliveUntilFinished() {
  setTimeout(keepAliveUntilFinished, 10000)
}
