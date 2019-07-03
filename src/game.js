let utils = require("./utils");

let roll = utils.roll;

module.exports = {
  play
};

function play(players) {
  console.log("********** starting new game *************");

  // preface results as 0 wins for everyone
  let results = new Array(players.length).fill(0);

  // pair each player against all following players in list
  for (var i = 0; i < players.length; i++) {
    for (var j = i + 1; j < players.length; j++) {
      let player1 = players[i];
      let player2 = players[j];

      // record winner of each match
      let winner = playMatch(player1, player2);

      if (winner === player1) {
        results[i]++;
      } else {
        results[j]++;
      }
    }
  }

  // calculate which player has the winningest result
  let winningestResult = results
    .map((r, i) => ({ wins: r, player: players[i] }))
    .reduce((a, b) => (a.wins > b.wins ? a : b));

  console.log("***");
  console.log("");
  console.log(`final results: ${results}`);
  console.log(`winningestPlayer: ${winningestResult.player.name}`);
  console.log("");
  console.log("***");
}

// each match will scope a closure for the matched players and implement functions
// which execute the match. we never modify the players themselves but do read values
// from them in executing certain functions such as initiative, dodge, and crticials
// as well seeding their initial health
function playMatch(p1, p2) {
  console.log(`~~~~~~~~ ${p1.name} - vs - ${p2.name} ~~~~~~~~~~`);
  let candidates = [
    { matchHealth: p1.health, player: p1 },
    { matchHealth: p2.health, player: p2 }
  ];
  let maxAttacks = Math.max(p1.attacks, p2.attacks);

  let i = 0;
  while (true) {
    let maybeWinner = playRound();
    if (maybeWinner) return maybeWinner;
  }

  // play new rounds until a round ends with a winner
  // the match health for each player will be tracked in a candidate object
  // with a pointer to the player (treat as immutable)
  function playRound() {
    console.log(`######## ROUND ${++i} ########`);

    let [first, second] = selectOrder();

    let turns = 0;
    while (turns < maxAttacks) {
      // each player attacks if they are allowed, in the order set by the initiave above
      if (turns < first.player.attacks) {
        if (resolveAttack(first, second)) {
          // games end eagerly whenever attacks are resolved
          return completeWithWinner(first.player);
        }
      }
      if (turns < second.player.attacks) {
        if (resolveAttack(second, first)) {
          return completeWithWinner(second.player);
        }
      }
      turns++;
    }
  }

  function selectOrder() {
    let r1 = roll(p1.initiative);
    let r2 = roll(p2.initiative);
    let first = roll(p1.initiative) > roll(p2.initiative) ? p1 : p2;
    console.log(
      `${name(first)} is randomly selected to go first (${
        r1 > r2 ? r1 : r2
      } > ${r1 > r2 ? r2 : r1})`
    );
    return first === p1 ? [candidates[0], candidates[1]] : [candidates[1], candidates[0]];
  }

  function resolveAttack(attacker, defender) {
    let aPlayer = attacker.player;
    let dPlayer = defender.player;

    let initialHealth = defender.matchHealth;
    let damage = aPlayer.damage;

    if (hasDodged(attacker, defender)) {
      return false;
    }

    let multipler = hasCritical(attacker) ? 2 : 1;
    damage *= multipler;

    let finalHealth = (defender.matchHealth = initialHealth - damage);

    console.log(
      `${name(aPlayer)} hits ${name(
        dPlayer
      )} for ${damage} damage (${initialHealth} -> ${finalHealth})`
    );

    return finalHealth <= 0;
  }

  function name(p) {
    return p === p1 ? "Candidate 1" : "Candidate 2";
  }

  function completeWithWinner(winner) {
    console.log(`${name(winner)} wins!`);
    return winner;
  }

  function hasDodged(attacker, defender) {
    let aPlayer = attacker.player;
    let dPlayer = defender.player;
    let dodgeRoll = roll();
    if (dodgeRoll < dPlayer.dodge) {
      console.log(
        `${name(aPlayer)} misses ${name(dPlayer)} [dodge] (${
          dPlayer.dodge
        } > ${dodgeRoll})`
      );
      return true;
    }
    return false;
  }

  function hasCritical(attacker) {
    let player = attacker.player;
    let critRoll = roll();
    if (critRoll < player.critical) {
      console.log(
        `${name(player)} will deal a MASSIVE strike! [critical] (${
          player.critical
        } > ${critRoll})`
      );
      return true;
    }
    return false;
  }
}
