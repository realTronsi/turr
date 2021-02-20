const { dist } = require("./dist");

function getNearestPlayer(arena, tower) {
	let collider = null;
	let collider_dist = tower.range + 1;
	arena.playerqt.onCollision({
		x: tower.x - tower.range,
		y: tower.y - tower.range,
		width: tower.range * 2,
		height: tower.range * 2
	}, function(player) {
		// remember to use player.width since this is the player object inside the quadtree
		let distance = dist(tower.x, tower.y, player.x + player.width / 2, player.y + player.width / 2);
		if (distance < collider_dist) {
			collider_dist = distance;
			collider = player.gameId;
		}
	}, function(element1, element2) {
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < tower.range && element2.gameId != tower.parentId && arena.players[element2.gameId].spawnProt <= 0)
	});
	return collider;
}

function getNearestTower(arena, tower) {
	let collider = null;
	let collider_dist = tower.range + 1;
	arena.towerqt.onCollision({
		x: tower.x - tower.range,
		y: tower.y - tower.range,
		width: tower.range * 2,
		height: tower.range * 2,
		parentId: tower.parentId
	}, function(enemy) {
		// remember to use player.width since this is the player object inside the quadtree
		let distance = dist(tower.x, tower.y, enemy.x + enemy.width / 2, enemy.y + enemy.width / 2);
		if (distance < collider_dist) {
			collider_dist = distance;
			collider = enemy.id;
		}
	}, function(element1, element2) {
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < tower.range && element1.parentId != element2.parentId)
	});
	return collider;
}

function getAuraPlayerCollider(arena, tower) {
	let collisions = arena.playerqt.colliding({
		x: tower.x - tower.size,
		y: tower.y - tower.size,
		width: tower.size * 2,
		height: tower.size * 2
	}, function(element1, element2) {
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < tower.radius && arena.players[element2.gameId].spawnProt <= 0 && element2.gameId != tower.parentId)
	})
	return collisions;
}

module.exports = { getNearestPlayer, getNearestTower, getAuraPlayerCollider }