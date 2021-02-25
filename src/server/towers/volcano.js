const { TowerStats, ElementStats } = require(".././stats");
const { Bullet } = require(".././objects.js");

function randPolarity() {
	if (Math.random() < 0.5) return 1;
	return -1;
}

function volcanoTower(arena, tower, delta) {
	if(tower.hp < tower.explosionTimer && tower.state == "normal"){
		tower.state = "exploding";
		tower.animation = 1;
		tower.changed["animation"] = true;
	}
	if(tower.state == "exploding"){
		tower.animation = (tower.explosionTimer - tower.hp)/30;
		tower.changed["animation"] = true;
	}
	if(tower.hp <= 0){
		let bulletId = arena.createBulletId();
		arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, 0, TowerStats[tower.type].bullet, tower);
		let dir = 2.094;
		for(let i=0; i<3; i++){
			bulletId = arena.createBulletId();
			arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, dir + (Math.random()/2*randPolarity()), TowerStats[tower.type].bullet2, tower);
			dir+=2.0944;
		}
		dir = 0.897;
		for(let i=0; i<7; i++){
			bulletId = arena.createBulletId();
			arena.bullets[bulletId] = new Bullet(bulletId, tower.x, tower.y, dir + (Math.random()/4*randPolarity()), TowerStats[tower.type].bullet3, tower);
			dir+=0.897;
		}
	}
}

module.exports = volcanoTower