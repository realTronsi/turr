const { dist } = require(".././utils/dist");
const electricityChain = require(".././utils/electricityChain");
const msgpack = require("msgpack-lite");

function electricityBullet(arena, bullet, delta, b) {
	if (bullet.die != true) {
		bullet.stats.timer -= delta;
		if (bullet.stats.nodes.length < bullet.stats.maxChain) {
			if (bullet.stats.timer <= 0) {
				// chain to next enemy
				let collides = electricityChain(arena, bullet);
				let closest, closestDist = null;
				for (let collide of collides) {
					if (closest == undefined) {
						closest = collide;
						closestDist = dist(bullet.x, bullet.y, collide.x + collide.width / 2, collide.y + collide.width / 2) - collide.width / 2;
						continue;
					}
					let distance = dist(bullet.x, bullet.y, collide.x + collide.width / 2, collide.y + collide.width / 2) - collide.width / 2;

					if (distance < closestDist) {
						closest = collide;
						closestDist = distance;
						continue;
					}
				}
				if (closest != null) {
					if (closest.gameId != undefined) {
						let player = arena.players[closest.gameId];
						player.hp -= bullet.stats.damage * delta / 37;
						player.isDamaged = true;
						if (player.hp <= 0) {
							// collider died
							player.die(arena, arena.players[bullet.parentId]);
							let deleteQtPlayer = arena.playerqt.find(function(element) {
								return element.gameId === player.gameId
							})
							if (deleteQtPlayer.length > 0) {
								arena.playerqt.remove(deleteQtPlayer[0]);
							}
						}
						bullet.stats.nodes.push(player);
						bullet.changed["nodes"] = 1;
					} else {
						if (arena.towers[closest.id] != undefined) {
							arena.towers[closest.id].hp -= bullet.stats.damage * delta / 37;
							bullet.stats.nodes.push(arena.towers[closest.id]);
							bullet.changed["nodes"] = 1;
						}
					}
					bullet.stats.timer += bullet.stats.chainSpeed;
				} else {
					// no one in range for next chain
					bullet.die = true;
				}
			}
		}

		if (bullet.stats.nodes.length >= bullet.stats.maxChain) {
			bullet.die = true;
		}
	}
}

module.exports = electricityBullet;