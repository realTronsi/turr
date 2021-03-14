const { dist } = require("./dist");

function electricityChain(arena, bullet) {
	let pt = bullet.stats.nodes.map(n => n.gameId == undefined? -1 : n.gameId);

	let collisions = arena.playerqt.colliding({
		x: bullet.stats.nodes[bullet.stats.nodes.length - 1].x - bullet.stats.chainDistance,
		y: bullet.stats.nodes[bullet.stats.nodes.length - 1].y - bullet.stats.chainDistance,
		width: bullet.stats.chainDistance * 2,
		height: bullet.stats.chainDistance * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.chainDistance && bullet.parentId != element2.gameId && arena.players[element2.gameId].spawnProt <= 0 && pt.includes(element2.gameId) == false)
	});

	pt = bullet.stats.nodes.map(n => n.team == -1 ? -1 : (n.id == undefined? -1 : n.id));

	let towerCollisions = arena.towerqt.colliding({
		x: bullet.stats.nodes[bullet.stats.nodes.length - 1].x - bullet.stats.chainDistance,
		y: bullet.stats.nodes[bullet.stats.nodes.length - 1].y - bullet.stats.chainDistance,
		width: bullet.stats.chainDistance * 2,
		height: bullet.stats.chainDistance * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.chainDistance && bullet.parentId != element2.parentId && pt.includes(element2.id) == false)
	});

  pt = bullet.stats.nodes.map(n => n.team != -1 ? -1 : (n.id == undefined? -1 : n.id));

	let enemyCollisions = arena.enemyqt.colliding({
		x: bullet.stats.nodes[bullet.stats.nodes.length - 1].x - bullet.stats.chainDistance,
		y: bullet.stats.nodes[bullet.stats.nodes.length - 1].y - bullet.stats.chainDistance,
		width: bullet.stats.chainDistance * 2,
		height: bullet.stats.chainDistance * 2
	}, function(element1, element2) {
		if(element2.team == bullet.team) return false;

		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.chainDistance && pt.includes(element2.id) == false)
	});

  

	collisions = collisions.concat(towerCollisions);
  collisions = collisions.concat(enemyCollisions)

	return collisions;
}

module.exports = electricityChain;