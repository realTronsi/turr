const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");

function poisonBullet(arena, bullet, delta, b) {
	bullet.x += bullet.xv * delta;
	bullet.y += bullet.yv * delta;
	bullet.changed["x"] = true;
	bullet.changed["y"] = true;
	bullet.stats.hp -= bullet.stats.decay * delta;

	let collides = getBulletCollider(arena, bullet);
	for (let collider of collides) {
		bullet.stats.hp -= 20 * delta / 37;
		if (collider.gameId != undefined) {
			if (arena.players[collider.gameId].effects.poison == null || (arena.players[collider.gameId].effects.poison.effect <= bullet.stats.effect && arena.players[collider.gameId].effects.poison.duration < bullet.stats.duration)) {
				if (arena.players[collider.gameId].effects.poison == null) {
					arena.players[collider.gameId].effects.poison = {};
				}
				arena.players[collider.gameId].effects.poison.effect = bullet.stats.effect;
				arena.players[collider.gameId].effects.poison.duration = bullet.stats.duration;
				arena.players[collider.gameId].effects.poison.parent = bullet.parentId;
				if (arena.players[collider.gameId].effects.poison.reload == null) {
					arena.players[collider.gameId].effects.poison.reload = 0;
				}
			}

			arena.players[collider.gameId].hp -= bullet.stats.damage * delta / 37;
			arena.players[collider.gameId].isDamaged = true;

			if (arena.players[collider.gameId].hp <= 0) {
				// collider died
				arena.players[collider.gameId].die(arena, bullet.parentId);
				let deleteQtPlayer = arena.playerqt.find(function(element) {
					return element.gameId === collider.gameId
				})
				if (deleteQtPlayer.length > 0) {
					arena.playerqt.remove(deleteQtPlayer[0]);
				}
			}
		} else if (collider.team == -1) {
			if (arena.enemies[collider.id] != undefined) {
				bullet.stats.hp = 0;
        const enemy = arena.enemies[collider.id];
				if (arena.enemies[collider.id].effects.poison == null || (arena.enemies[collider.id].effects.poison.effect <= bullet.stats.effect && arena.enemies[collider.id].effects.poison.duration < bullet.stats.duration)) {
					if (arena.enemies[collider.id].effects.poison == null) {
						arena.enemies[collider.id].effects.poison = {};
					}
					arena.enemies[collider.id].effects.poison.effect = bullet.stats.effect;
					arena.enemies[collider.id].effects.poison.duration = bullet.stats.duration;
					arena.enemies[collider.id].effects.poison.parent = bullet.parentId;
					if (arena.enemies[collider.id].effects.poison.reload == null) {
						arena.enemies[collider.id].effects.poison.reload = 0;
					}
				}
				enemy.hp -= bullet.stats.damage * delta / 37;
				enemy.changed["hp"] = true;
				if (enemy.hp <= 0) {
					enemy.die(arena, bullet.parentId);
				}
			}
		} else {
			if (arena.towers[collider.id] != undefined) {
				bullet.stats.hp = 0;
			}
		}
	}

	if (bullet.x < bullet.stats.size || bullet.x > arena.width - bullet.stats.size || bullet.y < bullet.stats.size || bullet.y > arena.height - bullet.stats.size) {
		// hits wall
		bullet.stats.hp = 0;
	}

	if (bullet.stats.hp <= 0) {
		//Send Packet to Everyone
		for (let player of bullet.seenBy) {
			const payLoad = {
				t: "rb",
				i: bullet.id,
				x: bullet.x,
				y: bullet.y
			}
			player.ws.send(msgpack.encode(payLoad));
		}
		delete arena.bullets[b];
	}
}

module.exports = poisonBullet;