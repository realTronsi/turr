const { getNearestPlayer, getNearestEnemy, getNearestTower, getAuraPlayerCollider } = require(".././utils/towerCollide");

function healTower(arena, tower, delta) {
	let colliders = getAuraPlayerCollider(arena, tower, 0);
	for (let c of colliders) {
		const player = arena.players[c.gameId];
		if (player != undefined) {
			player.hp += tower.effect * delta * tower.parentStats.defense / 100;
			player.hp = Math.min(player.hp, player.stats.defense);
		}
	}
}

module.exports = healTower