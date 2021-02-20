const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestTower, getAuraPlayerCollider } = require(".././utils/towerCollide");

function drownTower(arena, tower, delta) {
let colliders = getAuraPlayerCollider(arena, tower);
	for (let c of colliders) {
		const player = arena.players[c.gameId];
		if (player != undefined) {
			player.effects.drowned = Math.min(tower.effect, player.effects.drowned);
		}
	}
}

module.exports = drownTower