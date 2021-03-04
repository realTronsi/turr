const { getNearestPlayer, getNearestTower, getAuraPlayerCollider } = require(".././utils/towerCollide");

function healTower(arena, tower, delta) {
	let colliders = getAuraPlayerCollider(arena, tower, 0);
	const parent = arena.players[tower.parentId];
	for (let c of colliders) {
		const player = arena.players[c.gameId];
		if (player != undefined) {
			player.hp += tower.effect * delta * parent.stats.defense / 100;
			player.hp = Math.min(player.hp, player.stats.defense);
		}
	}
}

module.exports = healTower