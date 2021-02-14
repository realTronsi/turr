const msgpack = require("msgpack-lite");
const { dist } = require("./utils/dist");
const { reduce_num } = require("./utils/numred");


function update(arenas, delta) { // main game loop
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];


    if (arena.playerCount == 0) continue;

    // PLAYERS UPDATE
    for (let p of Object.keys(arena.players)) {
      const player = arena.players[p];
      let foundQtPlayer = arena.playerqt.find(function(element) {
        return element.gameId === player.gameId
      })
      let qtPlayer;
      if (foundQtPlayer.length > 0) {
        qtPlayer = foundQtPlayer[0];
      }

      // ATTRIBUTES //

      player.changed["energy"] = true;
      if (player.energy >= player.stats.maxEnergy) {
        player.changed["energy"] = false;
      }
      player.energy += 0.01 * delta;
      if (player.energy > player.stats.maxEnergy) {
        player.energy = player.stats.maxEnergy;
      }
      player.changed["health"] = true;
      if (player.hp >= player.stats.defense) {
        player.changed["health"] = false;
      }
      player.hp += 0.001 * delta;
      if (player.hp > player.stats.defense) {
        player.hp = player.stats.defense;
      }

      // MOVEMENT //

      let normalizedxv = 0;
      let normalizedyv = 0;
      if (player.keys["ArrowLeft"] || player.keys["a"]) {
        normalizedxv = -1;
      }
      if (player.keys["ArrowRight"] || player.keys["d"]) {
        normalizedxv = 1;
      }
      if (player.keys["ArrowDown"] || player.keys["s"]) {
        normalizedyv = 1;
      }
      if (player.keys["ArrowUp"] || player.keys["w"]) {
        normalizedyv = -1;
      }

      const normalize_magnetitude = Math.sqrt(normalizedxv * normalizedxv + normalizedyv * normalizedyv);

      normalizedxv /= (normalize_magnetitude || 1);
      normalizedyv /= (normalize_magnetitude || 1);

      player.xv += normalizedxv * player.stats.speed;
      player.yv += normalizedyv * player.stats.speed;


      player.xv *= Math.pow(player.stats.friction, delta / 25);
      player.yv *= Math.pow(player.stats.friction, delta / 25);


      if (Math.abs(player.xv) < 0.06) {
        player.xv = 0;
      }
      if (Math.abs(player.yv) < 0.06) {
        player.yv = 0;
      }

      if (player.xv != 0) {
        player.changed["x"] = true;
      }
      if (player.yv != 0) {
        player.changed["y"] = true;
      }

      player.x += player.xv * delta / 25;
      player.y += player.yv * delta / 25;

      // tower collision

      arena.towerqt.onCollision({
        x: player.x - player.size,
        y: player.y - player.size,
        width: player.size * 2,
        height: player.size * 2
      }, function(tower) {
        let dx = player.x - (tower.x + tower.width / 2);
        let dy = player.y - (tower.y + tower.width / 2);
        let l = Math.sqrt(dx * dx + dy * dy) || 1;
        let xv = dx / l;
        let yv = dy / l;
        player.x = tower.x + tower.width / 2 + (player.size * 2 + 0.01 + player.size) * xv;
        player.y = tower.y + tower.width / 2 + (player.size * 2 + 0.01 + player.size) * yv;

        player.changed["x"] = true;
        player.changed["y"] = true;
      }, function(element1, element2) {
        return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
      });

      // wall collision
      let lastX = player.x;
      let lastY = player.y;
      player.x = Math.min(Math.max(player.x, player.size), arena.width - player.size)
      player.y = Math.min(Math.max(player.y, player.size), arena.height - player.size)
      if (lastX != player.x) {
        player.changed["x"] = true;
      }
      if (lastY != player.y) {
        player.changed["y"] = true;
      }

      if (qtPlayer != undefined) {
        qtPlayer.x = player.x - player.size;
        qtPlayer.y = player.y - player.size;
      }
    }

    // TOWERS UPDATE
    for (let t of Object.keys(arena.towers)) {
      const tower = arena.towers[t];

      tower.hp -= tower.decay * delta;

      if (tower.type == "farm") {
        //Farm Code
        if (arena.players[tower.parentId] != undefined) {
          let oldxp = reduce_num(arena.players[tower.parentId].xp);
          arena.players[tower.parentId].xp += delta / 100;
          if (oldxp != reduce_num(arena.players[tower.parentId].xp)) {
            arena.players[tower.parentId].changed["xp"] = true;
          }
        }
      } else if (tower.type == "basic"){
        //Basic Code
				tower.reload -= delta;
				tower.reload = Math.max(tower.reload, 0);

        let nearestPlayerId = getNearestPlayer(arena, tower);
				if(nearestPlayerId != null){
					let nearestPlayer = arena.players[nearestPlayerId];
          let lastDir = tower.dir;
					tower.dir = Math.atan2(nearestPlayer.y - tower.y, nearestPlayer.x - tower.x);
          //if (lastDir != tower.dir){
					  tower.changed["d"] = true;
          //}
          
				} else {
					// there is no player in range
					let nearestTowerId = getNearestTower(arena, tower);
					if(nearestTowerId != null){
						let nearestTower = arena.towers[nearestTowerId];
            let lastDir = tower.dir;
            tower.dir = Math.atan2(nearestTower.y - tower.y, nearestTower.x - tower.x);
            //if (lastDir != tower.dir){
					    tower.changed["d"] = true;
            //}
					}
				}
			}


      if (tower.hp <= 0) {
        // tower dead
        let deleteQtTower = arena.towerqt.find(function(element) {
          return element.id === tower.id
        })
        if (deleteQtTower.length > 0) {
          arena.towerqt.remove(deleteQtTower[0]);
        }
        for (let player of tower.seenBy) {
          const payLoad = {
            t: "rt", //remove tower
            id: tower.id
          }
          player.ws.send(msgpack.encode(payLoad))
        }

        delete arena.towers[t];
      }
    }

    //BULLETS UPDATE (totally done btw)
  }
}

//

function getNearestPlayer(arena, tower){
	let collider = null;
	let collider_dist = tower.range + 1;
	arena.playerqt.onCollision({
		x: tower.x - tower.range,
		y: tower.y - tower.range,
		width: tower.range*2,
		height: tower.range*2
	}, function(player){
		// remember to use player.width since this is the player object inside the quadtree
		let distance = dist(tower.x, tower.y, player.x + player.width/2, player.y + player.width/2);
		if(distance < collider_dist){
			collider_dist = distance;
			collider = player.gameId;
		}
	}, function(element1, element2){
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < tower.range && element2.gameId != tower.parentId)
	});
	return collider;
}

function getNearestTower(arena, tower){
	let collider = null;
	let collider_dist = tower.range + 1;
	arena.towerqt.onCollision({
		x: tower.x - tower.range,
		y: tower.y - tower.range,
		width: tower.range*2,
		height: tower.range*2,
		parentId: tower.parentId
	}, function(enemy){
		// remember to use player.width since this is the player object inside the quadtree
		let distance = dist(tower.x, tower.y, enemy.x + enemy.width/2, enemy.y + enemy.width/2);
		if(distance < collider_dist){
			collider_dist = distance;
			collider = enemy.id;
		}
	}, function(element1, element2){
		return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < tower.range && element1.parentId != element2.parentId)
	});
	return collider;
}

function sendToPlayers(arenas, delta) {
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];

    for (let p of Object.keys(arena.players)) {
      const player = arena.players[p];
      const playerUpdatePacks = [];
      const towerUpdatePacks = [];

      for (let k of Object.keys(arena.players)) {
        const candidate = arena.players[k];
        if (Math.abs(candidate.x - player.x) <= 1 / player.fov * 800 + candidate.size && Math.abs(candidate.y - player.y) <= 1 / player.fov * 450 + candidate.size) { // make sure player is in fov
          let playerPack = {};
          if (!player.inFov.includes(candidate)) {
            // candidate just got into player fov
            player.inFov.push(candidate);
            playerPack = {
              g: candidate.gameId,
              x: candidate.x,
              y: candidate.y,
              ip: 0
              // size and other attributes later
            };
          } else {
            playerPack = candidate.getUpdatePack();
          }
          if (Object.keys(playerPack).length > 0) {
            playerUpdatePacks.push(playerPack);
          }
        } else {
          if (player.inFov.includes(candidate)) {
            player.inFov.splice(player.inFov.indexOf(candidate), 1);
            playerUpdatePacks.push({
              g: candidate.gameId,
              ip: -1
            });
          }
        }
      }
      for (let t of Object.keys(arena.towers)) {
        const tower = arena.towers[t];
        if (Math.abs(tower.x - player.x) <= 1 / player.fov * 800 + tower.size && Math.abs(tower.y - player.y) <= 1 / player.fov * 450 + tower.size) { // make sure tower is in fov
          if (!tower.seenBy.includes(player)) {
            // player has never seen tower
            towerUpdatePacks.push(tower.getInitPack());
            tower.seenBy.push(player);
          } else {
            // player has seen tower
            towerUpdatePacks.push(tower.getUpdatePack());
          }
        }
      }
      let sendEnergy = player.changed["energy"];
      let sendHealth = player.changed["health"];
      let sendXP = player.changed["xp"];


      const payLoad = {
        t: "u",
        p: playerUpdatePacks,
        tp: towerUpdatePacks
      };
      if (sendEnergy) {
        payLoad.e = player.energy;
      }
      if (sendHealth) {
        payLoad.h = player.hp;
      }
      if (sendXP) {
        payLoad.xp = player.xp;
      }
      player.ws.send(msgpack.encode(payLoad));
    }
    for (let p of Object.keys(arena.players)) {
      arena.players[p].changed = {}; // reset changed properties
    }
  }
}



// LEADERBOARD

function updateArenaLeaderboard(arena) {
  let scores = [];

  for (let p of Object.keys(arena.players)) {
    scores.push({
      id: arena.players[p].gameId,
      xp: arena.players[p].xp
    });
  }

  scores = scores.sort((a, b) => b.xp - a.xp);
  let place = 0;
  for (let i of scores) {
    place++;
    arena.players[i.id].place = place;
    i.place = place;
  }
  scores = scores.slice(0, 3);

  for (let score of scores) {
    score.xp = reduce_num(score.xp);
  }

  arena.lb = JSON.parse(JSON.stringify(scores));
  // lb changed
  for (let pp of Object.keys(arena.players)) {
    // check if they're in lb
    const payLoad = {
      t: "lb",
      lb: JSON.parse(JSON.stringify(scores))
    }
    if (arena.players[pp].place <= 3) {
      // in top 3
    } else {
      payLoad.lb.push({
        place: arena.players[pp].place,
        id: Number(pp),
        xp: reduce_num(arena.players[pp].xp)
      });
    }
    // send lb
    arena.players[pp].ws.send(msgpack.encode(payLoad));
  }
}

function updateLeaderboard(arenas) {
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];
    let scores = [];

    for (let p of Object.keys(arena.players)) {
      scores.push({
        id: arena.players[p].gameId,
        xp: arena.players[p].xp
      });
    }

    scores = scores.sort((a, b) => b.xp - a.xp);
    let place = 0;
    for (let i of scores) {
      place++;
      arena.players[i.id].place = place;
      i.place = place;
    }
    scores = scores.slice(0, 3);

    for (let score of scores) {
      score.xp = reduce_num(score.xp);
    }

    if (JSON.stringify(arena.lb) != JSON.stringify(scores)) {
      arena.lb = JSON.parse(JSON.stringify(scores));
      // lb changed
      for (let pp of Object.keys(arena.players)) {
        // check if they're in lb
        const payLoad = {
          t: "lb",
          lb: JSON.parse(JSON.stringify(scores))
        }
        if (arena.players[pp].place <= 3) {
          // in top 3
        } else {
          payLoad.lb.push({
            place: arena.players[pp].place,
            id: Number(pp),
            xp: reduce_num(arena.players[pp].xp)
          });
        }
        // send lb
        arena.players[pp].ws.send(msgpack.encode(payLoad));
      }
    }

  }
}

module.exports = { update, sendToPlayers, updateLeaderboard, updateArenaLeaderboard }