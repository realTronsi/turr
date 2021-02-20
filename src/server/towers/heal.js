const { dist } = require(".././utils/dist");

function healTower(arena, tower, delta) {
const parent = arena.players[tower.parentId];
				if (parent != undefined) {
					if (dist(parent.x, parent.y, tower.x, tower.y) < parent.size + tower.radius) {
						// parent is being healed
						parent.hp += tower.effect * delta * parent.stats.defense / 100;
						parent.hp = Math.min(parent.hp, parent.stats.defense);
					}
				}
}

module.exports = healTower