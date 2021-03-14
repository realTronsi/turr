const { dist } = require("./dist");

function getBulletCollider(arena, bullet) {
	let collisions = arena.playerqt.colliding({
		x: bullet.x - bullet.stats.size,
		y: bullet.y - bullet.stats.size,
		width: bullet.stats.size * 2,
		height: bullet.stats.size * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.size + element2.width / 2 && bullet.parentId != element2.gameId && arena.players[element2.gameId].spawnProt <= 0)
	});

  let enemyCollisions = arena.enemyqt.colliding({
		x: bullet.x - bullet.stats.size,
		y: bullet.y - bullet.stats.size,
		width: bullet.stats.size * 2,
		height: bullet.stats.size * 2
	}, function(element1, element2) {
		if (element2.team == bullet.team) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.size + element2.width / 2)
	});


	/*let debug = [];

	let element1 = {
		x: bullet.x - bullet.stats.size,
		y: bullet.y - bullet.stats.size,
		width: bullet.stats.size * 2,
		height: bullet.stats.size * 2
	}

	arena.playerqt.each(function (element2){
		if((dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.size + element2.width / 2 && bullet.parentId != element2.gameId && arena.players[element2.gameId].spawnProt <= 0) == true){
			debug.push(element2);
		}
	})

	console.log(debug.length === collisions.length);*/

	let towerCollisions = arena.towerqt.colliding({
		x: bullet.x - bullet.stats.size,
		y: bullet.y - bullet.stats.size,
		width: bullet.stats.size * 2,
		height: bullet.stats.size * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < bullet.stats.size + element2.width / 2 && bullet.parentId != element2.parentId)
	});

	collisions = collisions.concat(towerCollisions);
  collisions = collisions.concat(enemyCollisions);

	return collisions;
}

module.exports = getBulletCollider;