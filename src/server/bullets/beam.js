const getBeamCollider = require(".././utils/beamCollide");
const msgpack = require("msgpack-lite");

function beamBullet(arena, bullet, delta, b) {
	if (bullet.tower.hasTarget != null) {
		bullet.stats.end = {
			x: bullet.stats.start.x + Math.cos(bullet.tower.dir) * bullet.tower.range,
			y: bullet.stats.start.y + Math.sin(bullet.tower.dir) * bullet.tower.range
		}
		bullet.changed["end"] = true;
	}

	let collides = getBeamCollider(arena, bullet);
	for (let collider of collides) {
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


	if (arena.towers[bullet.tower.id] == undefined || arena.towers[bullet.tower.id].hasTarget == null) {
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

module.exports = beamBullet;
