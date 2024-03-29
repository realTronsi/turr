const { dist } = require(".././utils/dist");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestEnemy, getNearestTower } = require(".././utils/towerCollide");

function blowerTower(arena, tower, delta) {
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
		let nearestEnemyId = getNearestEnemy(arena, tower);
		if(nearestEnemyId != null){
			let nearestEnemy = arena.enemies[nearestEnemyId];
      let lastDir = tower.dir;
      tower.dir = Math.atan2(nearestEnemy.y - tower.y, nearestEnemy.x - tower.x);
      if (lastDir != tower.dir){
        tower.changed["d"] = true;
      }
      tower.hasTarget = true;
		} else {
			tower.hasTarget = false;
		}
	}

	if (tower.reload < 0) {
		tower.reload += tower.maxReload;
		if (tower.hasTarget) {
			//Shoot Bullet
			let bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, tower.dir, tower.bullets.bullet1, tower)
      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x + Math.cos(tower.dir + Math.PI/2) * 30, tower.y + Math.sin(tower.dir + Math.PI/2) * 30, tower.dir - 0.5236, tower.bullets.bullet1, tower)

      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x - Math.cos(tower.dir + Math.PI/2) * 30, tower.y - Math.sin(tower.dir + Math.PI/2) * 30, tower.dir + 0.5236, tower.bullets.bullet1, tower)
		}
	}
}

module.exports = blowerTower