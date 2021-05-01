const { getNearestPlayer, getNearestTower } = require(".././utils/enemyCollide");
const { dist } = require(".././utils/dist");
const getAngleDiff = require(".././utils/angleDiff");
const { Bullet } = require("../objects.js")

function archerEnemy(arena, enemy, delta) {
	let target = {
		x: arena.width / 2,
		y: arena.height / 2
	}; // base
	if (dist(enemy.x, enemy.y, target.x, target.y) < enemy.stats.range + arena.base.size) {
		// always target base 
		let angleToBase = Math.atan2(arena.height / 2 - enemy.y, arena.width / 2 - enemy.x);
    enemy.dir = angleToBase;
		enemy.hasTarget = true;
	} else {
		let nearestPlayerId = getNearestPlayer(arena, enemy);
		if (nearestPlayerId != null) {
			let nearestPlayer = arena.players[nearestPlayerId];
			let lastDir = enemy.dir;
			enemy.dir = Math.atan2(nearestPlayer.y - enemy.y, nearestPlayer.x - enemy.x);
			if (lastDir != enemy.dir) {
				enemy.changed["dir"] = true;
			}
			enemy.hasTarget = true;
		} else {
			let nearestTowerId = getNearestTower(arena, enemy);
			if (nearestTowerId != null) {
				let nearestTower = arena.towers[nearestTowerId];
				let lastDir = enemy.dir;
				enemy.dir = Math.atan2(nearestTower.y - enemy.y, nearestTower.x - enemy.x);
				if (lastDir != enemy.dir) {
					enemy.changed["dir"] = true;
				}
				enemy.hasTarget = true;
			} else {
				enemy.hasTarget = false;
			}
		}
	}

	if(dist(enemy.x, enemy.y, arena.width / 2, arena.height / 2) > enemy.stats.range + arena.base.size){
		let dir = Math.atan2(target.y - enemy.y, target.x - enemy.x);
		let xv = Math.cos(dir);
		let yv = Math.sin(dir);
		let m = Math.sqrt(xv * xv + yv * yv);
		xv /= m;
		yv /= m;
		xv *= enemy.stats.speed;
		yv *= enemy.stats.speed;

		enemy.xv = xv;
		enemy.yv = yv;
	}

	enemy.reload -= delta;

	if (!enemy.hasTarget && enemy.reload < 0) {
		enemy.reload = 0;
	}

	if (enemy.reload < 0) {
		enemy.reload += enemy.stats.maxReload;
    if (enemy.hasTarget){
		//Shoot Bullet
		const bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir, enemy.stats.bullet, enemy)
    }
	}
}

module.exports = archerEnemy;