const { reduce_num } = require(".././utils/numred");

function farmTower(arena, tower, delta) {
	if (arena.players[tower.parentId] != undefined) {
		let oldxp = reduce_num(arena.players[tower.parentId].xp);
		if(arena.gamemode == "sandbox"){
			arena.players[tower.parentId].xp += 1000 * delta;
		} else {
			arena.players[tower.parentId].xp += tower.effect * delta;
		}
		if (oldxp != reduce_num(arena.players[tower.parentId].xp)) {
			arena.players[tower.parentId].changed["xp"] = true;
		}
	}
}

module.exports = farmTower
