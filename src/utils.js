module.exports = {
  roll
}

// simple abstraction of D100 (I am assumming this is acceptable / standard)
// the roll type can be modified easily by various combintations of Math.random
function roll(modifier = 0) {
  return Math.floor(Math.random() * 100) + modifier
}
