const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");
const { Bullet } = require(".././objects.js");

function fireballBullet(arena, bullet, delta, b) {
	bullet.x += bullet.xv * delta;
	bullet.y += bullet.yv * delta;
	bullet.stats.hp -= bullet.stats.decay * delta;
  bullet.xv += (0 - bullet.xv)/10 * delta/70;
  bullet.yv += (0 - bullet.yv)/10 * delta/70;
  bullet.changed["x"] = true;
  bullet.changed["y"] = true;

	let collides = getBulletCollider(arena, bullet);
	for (let collider of collides) {
		bullet.stats.hp -= 20 * delta / 37;
		if (collider.gameId != undefined) {
			arena.players[collider.gameId].hp -= bullet.stats.damage * delta / 37;
			arena.players[collider.gameId].isDamaged = true;
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
		} else {
			if (arena.towers[collider.id] != undefined) {
				arena.towers[collider.id].hp -= bullet.stats.damage * delta / 37;
			}
		}
	}

  bullet.stats.miniReload -= delta;
  while (bullet.stats.miniReload < 0){
    bullet.stats.miniReload += 220;
    let dir;
    if (bullet.stats.miniDirection){
      dir = Math.atan2(bullet.yv, bullet.xv) + Math.PI/2;
    }
    else{
      dir = Math.atan2(bullet.yv, bullet.xv) - Math.PI/2;
    }
    bullet.stats.miniDirection = !bullet.stats.miniDirection;

    let id = arena.createBulletId();
    arena.bullets[id] = new Bullet(id, bullet.parentId, bullet.parentStats, bullet.x - bullet.xv*delta, bullet.y - bullet.yv*delta, dir, bullet.stats.bullet);

    bullet.stats.size -= 3;
    bullet.changed["s"] = true;
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

module.exports = fireballBullet;