const { dist } = require("./dist");

function getNearestPlayer(arena, enemy) {
	let collider = null;
	let collider_dist = enemy.range + 1;
	arena.playerqt.onCollision({
		x: enemy.x - enemy.range,
		y: enemy.y - enemy.range,
		width: enemy.range * 2,
		height: enemy.range * 2
	}, function(player) {
		let distance = dist(enemy.x, enemy.y, player.x + player.width / 2, player.y + player.width / 2);
		if (distance < collider_dist) {
			collider_dist = distance;
			collider = player.gameId;
		}
	}, function(element1, element2) {
		if(arena.players[element2.gameId] == undefined) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < enemy.range && arena.players[element2.gameId].spawnProt <= 0)
	});
	return collider;
}

function getNearestTower(arena, enemy) {
	let collider = null;
	let collider_dist = enemy.range + 1;
	arena.enemyqt.onCollision({
		x: enemy.x - enemy.range,
		y: enemy.y - enemy.range,
		width: enemy.range * 2,
		height: enemy.range * 2
	}, function(enemy) {
		let distance = dist(enemy.x, enemy.y, enemy.x + enemy.width / 2, enemy.y + enemy.width / 2);
		if (distance < collider_dist) {
			collider_dist = distance;
			collider = enemy.id;
		}
	}, function(element1, element2) {
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < enemy.range)
	});
	return collider;
}

module.exports = { getNearestPlayer, getNearestTower }