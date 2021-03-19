const { dist } = require(".././utils/dist");
const { Bullet } = require(".././objects.js");
const { getNearestPlayer, getNearestEnemy, getNearestTower } = require(".././utils/towerCollide");

function teslaCoilTower(arena, tower, delta) {
	tower.reload -= delta;


	let nearestPlayerId = getNearestPlayer(arena, tower);
	let nearestTowerId = getNearestTower(arena, tower);
	let nearestEnemyId = getNearestEnemy(arena, tower);

	if (nearestPlayerId != null || nearestTowerId != null || nearestEnemyId != null) {
		tower.hasTarget = true;
	} else {
		tower.hasTarget = false;
	}

  if (tower.reload < 400){
    if(tower.animation != 1){
			tower.animation = 1;
			tower.changed["animation"] = true;
		}
  }
	if (tower.reload < 0) {
		if(tower.animation != 1){
			tower.animation = 1;
			tower.changed["animation"] = true;
		}
		if (tower.hasTarget) {
			//Shoot Bullet
      tower.reload = tower.maxReload;
			const bulletId = arena.createBulletId();
			//id, parentId, x, y, dir, stats
			let bullet = new Bullet(bulletId, tower.x, tower.y, 0, tower.bullets.bullet1, tower);
			bullet.stats.nodes.push({
				x: tower.x,
				y: tower.y
			});
			arena.bullets[bulletId] = bullet;
			tower.animation = 0;
			tower.changed["animation"] = true;
		}
	}
}

module.exports = teslaCoilTower