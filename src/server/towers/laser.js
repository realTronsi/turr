const { dist } = require(".././utils/dist");
const { TowerStats, ElementStats } = require(".././stats");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestTower } = require(".././utils/towerCollide");

function laserTower(arena, tower, delta) {
	let nearestPlayerId = getNearestPlayer(arena, tower);
	if (nearestPlayerId != null) {
		let nearestPlayer = arena.players[nearestPlayerId];
		let lastDir = (tower.dir * 180 / Math.PI) % 360;
		let targetDir = (Math.atan2(nearestPlayer.y - tower.y, nearestPlayer.x - tower.x) * 180 / Math.PI) % 360;

		let mag = Math.min(Math.max((tower.range - dist(tower.x, tower.y, nearestPlayer.x, nearestPlayer.y))/tower.range, 0.4), 1);

		// slow spin
		if (lastDir != targetDir) {
			if (Math.abs(lastDir - targetDir) <= tower.spinSpeed * delta * mag * 180 / Math.PI) {
				tower.dir = targetDir * Math.PI / 180;
			} else {
				if (lastDir < targetDir) {
					if (Math.abs(lastDir - targetDir) < 180)
						tower.dir += tower.spinSpeed * mag * delta;
					else tower.dir -= tower.spinSpeed * mag * delta;
				} else {
					if (Math.abs(lastDir - targetDir) < 180)
						tower.dir -= tower.spinSpeed * mag * delta;
					else tower.dir += tower.spinSpeed * mag * delta;
				}
			}
			tower.changed["d"] = true;
		}
		tower.hasTarget = arena.players[nearestPlayerId];
	} else {
		// there is no player in range
		let nearestTowerId = getNearestTower(arena, tower);
		if (nearestTowerId != null) {
			let nearestTower = arena.towers[nearestTowerId];
			let lastDir = (tower.dir * 180 / Math.PI)%360;
			let targetDir = (Math.atan2(nearestTower.y - tower.y, nearestTower.x - tower.x) * 180 / Math.PI)%360;

			let mag = Math.min(Math.max((tower.range - dist(tower.x, tower.y, nearestTower.x, nearestTower.y))/tower.range, 0.4), 1);

			//slow spin
			if (lastDir != targetDir) {
				if (Math.abs(lastDir - targetDir) <= tower.spinSpeed * delta * mag * 180 / Math.PI) {
					tower.dir = targetDir * Math.PI / 180;
				} else {
					if (lastDir < targetDir) {
						if (Math.abs(lastDir - targetDir) < 180)
							tower.dir += tower.spinSpeed * mag * delta;
						else tower.dir -= tower.spinSpeed * mag * delta;
					} else {
						if (Math.abs(lastDir - targetDir) < 180)
							tower.dir -= tower.spinSpeed * mag * delta;
						else tower.dir += tower.spinSpeed * mag * delta;
					}
					tower.changed["d"] = true;
				}
			}
			tower.hasTarget = arena.towers[nearestTowerId];
		} else {
			tower.hasTarget = null;
			if(tower.beam != null){
				tower.beam.die == true;
			}
			tower.beam = null;
		}
	}

	if (tower.hasTarget != null) {
		if (tower.beam == null) {
			// no beam yet
			const bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			bullet = new Bullet(bulletId, tower.x, tower.y, 0, TowerStats[tower.type].bullet, tower);
			bullet.stats.start = {
				x: tower.x,
				y: tower.y
			}
			bullet.stats.end = {
				x: Math.cos(tower.dir) * tower.range,
				y: Math.sin(tower.dir) * tower.range
			}
			tower.beam = bullet;
			arena.bullets[bulletId] = bullet;
		}
	}
}

module.exports = laserTower