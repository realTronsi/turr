const { dist } = require(".././utils/dist");
const { TowerStats, ElementStats } = require(".././stats");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestTower } = require(".././utils/towerCollide");

function streamerTower(arena, tower, delta) {
	tower.reload -= delta;

	let nearestPlayerId = getNearestPlayer(arena, tower);
	if (nearestPlayerId != null) {
		let nearestPlayer = arena.players[nearestPlayerId];
		let lastDir = tower.dir;
		tower.dir = Math.atan2(nearestPlayer.y - tower.y, nearestPlayer.x - tower.x);
		if (lastDir != tower.dir) {
			tower.changed["d"] = true;
		}
		tower.hasTarget = true;
	} else {
		// there is no player in range
		let nearestTowerId = getNearestTower(arena, tower);
		if (nearestTowerId != null) {
			let nearestTower = arena.towers[nearestTowerId];
			let lastDir = tower.dir;
			tower.dir = Math.atan2(nearestTower.y - tower.y, nearestTower.x - tower.x);
			if (lastDir != tower.dir) {
				tower.changed["d"] = true;
			}
			tower.hasTarget = true;
		}
		else {
			tower.hasTarget = false;
		}
	}

	if (tower.reload < 0) {
		tower.reload += tower.maxReload;
		if (tower.hasTarget) {
			//Shoot Bullet
			const bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			arena.bullets[bulletId] = new Bullet(bulletId, tower.parentId, tower.parentStats, tower.x, tower.y, tower.dir, TowerStats[tower.type].bullet)
		}
	}
}

module.exports = streamerTower