const { getNearestPlayer, getNearestTower } = require(".././utils/enemyCollide");
const { dist } = require(".././utils/dist");
const getAngleDiff = require(".././utils/angleDiff");

function ninjaEnemy(arena, enemy, delta) {
	let target = {
		x: arena.width / 2,
		y: arena.height / 2
	}; // base
	let angleToBase = Math.atan2(arena.height/2 - enemy.y, arena.width/2 - enemy.x);
	let priority = 2.5;
	let nearestPlayerId = getNearestPlayer(arena, enemy);
	if (nearestPlayerId != null) {
		let nearestPlayer = arena.players[nearestPlayerId];
		let angleToPlayer = Math.atan2(nearestPlayer.y - enemy.y, nearestPlayer.x - enemy.x);

		let playerPriority = getAngleDiff(angleToBase * 180 / Math.PI, angleToPlayer * 180 / Math.PI);
		if(playerPriority < 90){
			playerPriority = Math.sqrt(90 / (playerPriority || 1));
			playerPriority *= Math.sqrt(enemy.range / (dist(enemy.x, enemy.y, nearestPlayer.x, nearestPlayer.y) || 1));
		} else {
			playerPriority = 0;
		}
		if(playerPriority > priority){
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
}

module.exports = ninjaEnemy;