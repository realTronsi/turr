const { dist } = require(".././utils/dist");
const { TowerStats, ElementStats } = require(".././stats");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestTower } = require(".././utils/towerCollide");

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
		tower.hasTarget = false;
	}

	if (tower.reload < 0) {
		tower.reload += tower.maxReload;
		if (tower.hasTarget) {
			//Shoot Bullet
			let bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, tower.dir, TowerStats[tower.type].bullet, tower)
      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x + Math.cos(tower.dir+Math.PI/2) * 25, tower.y + Math.sin(tower.dir + Math.PI/2) * 25, tower.dir, TowerStats[tower.type].bullet, tower)

      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x + Math.cos(tower.dir+Math.PI/2) * 50, tower.y + Math.sin(tower.dir + Math.PI/2) * 50, tower.dir, TowerStats[tower.type].bullet, tower)

      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x - Math.cos(tower.dir+Math.PI/2) * 25, tower.y - Math.sin(tower.dir + Math.PI/2) * 25, tower.dir, TowerStats[tower.type].bullet, tower)

      bulletId = arena.createBulletId();
      arena.bullets[bulletId] = new Bullet(bulletId, tower.x - Math.cos(tower.dir+Math.PI/2) * 50, tower.y - Math.sin(tower.dir + Math.PI/2) * 50, tower.dir, TowerStats[tower.type].bullet, tower)

      
		}
	}
}

module.exports = blowerTower