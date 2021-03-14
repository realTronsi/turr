const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestEnemy, getNearestTower, getAuraPlayerCollider } = require(".././utils/towerCollide");

function drownTower(arena, tower, delta) {
let colliders = getAuraPlayerCollider(arena, tower, 1);
	for (let c of colliders) {
		if(c.gameId != null){
			const player = arena.players[c.gameId];
			if (player != undefined) {
				player.effects.drowned = Math.min(tower.effect, player.effects.drowned);
			}
		} else {
			const enemy = arena.enemies[c.id];
			if (enemy != undefined) {
				enemy.effects.drowned = Math.min(tower.effect, enemy.effects.drowned);
			}
		}
	}
}

module.exports = drownTower