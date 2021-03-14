const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");

function cannonballBullet(arena, bullet, delta, b) {
	bullet.x += bullet.xv * delta;
	bullet.y += bullet.yv * delta;
	bullet.stats.hp -= bullet.stats.decay * delta;
  bullet.changed["x"] = true;
  bullet.changed["y"] = true;

	let collides = getBulletCollider(arena, bullet);
	for (let collider of collides) {
		bullet.stats.hp -= 20 * delta / 37;
		if (collider.gameId != undefined) {
			const player = arena.players[collider.gameId];
			player.hp -= bullet.stats.damage * delta / 37;
			player.isDamaged = true;

			player.bxv += (bullet.xv/bullet.stats.speed)*bullet.stats.knockback;
			player.byv += (bullet.yv/bullet.stats.speed)*bullet.stats.knockback;
			player.changed["x"] = true;
			player.changed["y"] = true;
			
			if (arena.players[collider.gameId].hp <= 0) {
				// collider died
				arena.players[collider.gameId].die(arena, arena.players[bullet.parentId]);
				let deleteQtPlayer = arena.playerqt.find(function(element) {
					return element.gameId === collider.gameId
				})
				if (deleteQtPlayer.length > 0) {
					arena.playerqt.remove(deleteQtPlayer[0]);
				}
			}
		} else if (collider.team == -1){
      if (arena.enemies[collider.id] != undefined){
        arena.enemies[collider.id].hp -= bullet.stats.damage * delta / 37;
        arena.enemies[collider.id].changed["hp"] = true;
        if (arena.enemies[collider.id].hp <= 0){
          arena.enemies[collider.id].die(arena, bullet.parentId);
        }
      }
    } else {
			if (arena.towers[collider.id] != undefined) {
				arena.towers[collider.id].hp -= bullet.stats.damage * bullet.stats.multiplier * delta / 37;
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

module.exports = cannonballBullet;