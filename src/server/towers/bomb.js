const { dist } = require(".././utils/dist");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestEnemy, getNearestTower } = require(".././utils/towerCollide");

function bombTower(arena, tower, delta) {
	tower.reload -= delta;

	let nearestPlayerId = getNearestPlayer(arena, tower);
	if (nearestPlayerId != null) {
		let nearestPlayer = arena.players[nearestPlayerId];
		tower.dir = Math.atan2(nearestPlayer.y - tower.y, nearestPlayer.x - tower.x);
		tower.hasTarget = true;
	} else {
		// there is no player in range
		let nearestEnemyId = getNearestEnemy(arena, tower);
		if(nearestEnemyId != null){
			let nearestEnemy = arena.enemies[nearestEnemyId];
      tower.dir = Math.atan2(nearestEnemy.y - tower.y, nearestEnemy.x - tower.x);
      tower.hasTarget = true;
		} else {
			let nearestTowerId = getNearestTower(arena, tower);
			if (nearestTowerId != null) {
				let nearestTower = arena.towers[nearestTowerId];
				tower.dir = Math.atan2(nearestTower.y - tower.y, nearestTower.x - tower.x);
				tower.hasTarget = true;
			}
			else {
				tower.hasTarget = false;
			}
		}
	}

	if (tower.reload < 0) {
		tower.reload += tower.maxReload;
		if (tower.hasTarget) {
			//Shoot Bullet
			const bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, tower.dir, tower.bullets.bullet1, tower)
		}
	}
}

module.exports = bombTower