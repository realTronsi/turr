const { getNearestPlayer, getNearestTower } = require(".././utils/enemyCollide");
const { dist } = require(".././utils/dist");
const getAngleDiff = require(".././utils/angleDiff");
const { Bullet } = require("../objects.js")

function frogEnemy(arena, enemy, delta) {
  let target = {
    x: arena.width / 2,
    y: arena.height / 2
  }; // base
  let angleToBase = Math.atan2(arena.height / 2 - enemy.y, arena.width / 2 - enemy.x);
  let priority = 2.5;
  let nearestPlayerId = getNearestPlayer(arena, enemy);
  if (nearestPlayerId != null) {
    let nearestPlayer = arena.players[nearestPlayerId];
    let angleToPlayer = Math.atan2(nearestPlayer.y - enemy.y, nearestPlayer.x - enemy.x);

    let playerPriority = getAngleDiff(angleToBase * 180 / Math.PI, angleToPlayer * 180 / Math.PI);
    if (playerPriority < 90) {
      playerPriority = Math.sqrt(90 / (playerPriority || 1));
      playerPriority *= Math.sqrt(enemy.range / (dist(enemy.x, enemy.y, nearestPlayer.x, nearestPlayer.y) || 1));
    } else {
      playerPriority = 0;
    }
    if (playerPriority > priority) {
      priority = playerPriority;
      target.x = nearestPlayer.x;
      target.y = nearestPlayer.y;
    }
  }

  let dir = Math.atan2(target.y - enemy.y, target.x - enemy.x);
  let xv = Math.cos(dir);
  let yv = Math.sin(dir);
  let m = Math.sqrt(xv * xv + yv * yv);
  xv /= m;
  yv /= m;
  xv *= enemy.speed;
  yv *= enemy.speed;

  enemy.xv = xv;
  enemy.yv = yv;

  enemy.hasTarget = true;

  if (nearestPlayerId != null) {
    let nearestPlayer = arena.players[nearestPlayerId];
    let lastDir = enemy.dir;
    enemy.dir = Math.atan2(nearestPlayer.y - enemy.y, nearestPlayer.x - enemy.x);
    if (lastDir != enemy.dir) {
      enemy.changed["dir"] = true;
    }
  }
  else {
    let nearestTowerId = getNearestTower(arena, enemy);
    if (nearestTowerId != null) {
      let nearestTower = arena.towers[nearestTowerId];
      let lastDir = enemy.dir;
      enemy.dir = Math.atan2(nearestTower.y - enemy.y, nearestTower.x - enemy.x);
      if (lastDir != enemy.dir) {
        enemy.changed["dir"] = true;
      }
    } else {
      enemy.hasTarget = false;
    }
  }
  enemy.reload -= delta;

  if (!enemy.hasTarget && enemy.reload < 0){
    enemy.reload = 0;
  }
  while (enemy.hasTarget && enemy.reload < 0){
    enemy.reload += enemy.maxReload;
    //Shoot Bullet
		const bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir, enemy.stats.bullet, enemy)
  }

  enemy.reload2 -= delta;

  if (!enemy.hasTarget && enemy.reload2 < 0){
    enemy.reload2 = 0;
  }
  while (enemy.hasTarget && enemy.reload2 < 0){
    enemy.reload2 += enemy.maxReload2;
    //Shoot Bullet
		let bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir + Math.PI, enemy.stats.bullet2, enemy)

		bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir + Math.PI - 0.5, enemy.stats.bullet2, enemy)

		bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir + Math.PI + 0.5, enemy.stats.bullet2, enemy)

    bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir - 1.1, enemy.stats.bullet3, enemy)

		bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir + 1.1, enemy.stats.bullet3, enemy)
    
    bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir - 0.2, enemy.stats.bullet3, enemy)

		bulletId = arena.createBulletId();
		//id, parentId, x, y, dir, stats
		arena.bullets[bulletId] = new Bullet(bulletId, enemy.x, enemy.y, enemy.dir + 0.2, enemy.stats.bullet3, enemy)
    

    enemy.boostxv += Math.cos(enemy.dir) * 17;
    enemy.boostyv += Math.sin(enemy.dir) * 17;
    


  }

  
}

module.exports = frogEnemy;