const msgpack = require("msgpack-lite");

function update(arenas, delta){ // main game loop
	for(let a of Object.keys(arenas)){
    const arena = arenas[a];


		if(arena.playerCount == 0) continue;
    
    for(let p of Object.keys(arena.players)){
      const player = arena.players[p];
      let foundQtPlayer = arena.playerqt.find(function(element){
        return element.gameId === player.gameId
      })
      let qtPlayer;
      if (foundQtPlayer.length > 0){
        qtPlayer = foundQtPlayer[0];
      }
      if (qtPlayer != undefined){
        qtPlayer.x = player.x;
        qtPlayer.y = player.y;
      }

			// ATTRIBUTES //

			player.changed["energy"] = true;
			if(player.energy >= player.stats.maxEnergy){
				player.changed["energy"] = false;
			}
			player.energy += 0.01 * delta;
      if (player.energy > player.stats.maxEnergy){
        player.energy = player.stats.maxEnergy;
      }
			player.changed["health"] = true;
			if(player.hp >= player.stats.defense){
				player.changed["health"] = false;
			}
			player.hp += 0.001 * delta;
      if (player.hp > player.stats.defense){
        player.hp = player.stats.defense;
      }

			// MOVEMENT //

			let normalizedxv = 0;
			let normalizedyv = 0;
      if (player.keys["ArrowLeft"] || player.keys["a"]){
        normalizedxv = -1;
      }
      if (player.keys["ArrowRight"] || player.keys["d"]){
        normalizedxv = 1;
      }
      if (player.keys["ArrowDown"] || player.keys["s"]){
        normalizedyv = 1;
      }
      if (player.keys["ArrowUp"] || player.keys["w"]){
        normalizedyv = -1;
      }

			const normalize_magnetitude = Math.sqrt(normalizedxv * normalizedxv + normalizedyv* normalizedyv);

			normalizedxv /= (normalize_magnetitude || 1);
			normalizedyv /= (normalize_magnetitude || 1);

			player.xv += normalizedxv * player.stats.speed;
			player.yv += normalizedyv * player.stats.speed;


			player.xv *= Math.pow(player.stats.friction, delta/25);
			player.yv *= Math.pow(player.stats.friction, delta/25);

      
      if (Math.abs(player.xv) < 0.06){
        player.xv = 0;
      }
      if (Math.abs(player.yv) < 0.06){
        player.yv = 0;
      }

      if (player.xv != 0){
        player.changed["x"] = true;
      }
      if (player.yv != 0){
        player.changed["y"] = true;
      }
      
      player.x += player.xv * delta / 25;
      player.y += player.yv * delta / 25;

			// WALL COLLISION
      let lastX = player.x;
      let lastY = player.y;
      player.x = Math.min(Math.max(player.x, player.size), arena.width-player.size)
      player.y = Math.min(Math.max(player.y, player.size), arena.height-player.size)
      if (lastX != player.x){
        player.changed["x"] = true;
      }
      if (lastY != player.y){
        player.changed["y"] = true;
      }
    }
  }
}

function sendToPlayers(arenas, delta){
	for(let a of Object.keys(arenas)){
    const arena = arenas[a];

    for(let p of Object.keys(arena.players)){
      const player = arena.players[p];
			const playerUpdatePacks = [];
			const towerUpdatePacks = [];

			for(let k of Object.keys(arena.players)){
				const candidate = arena.players[k];
				if(Math.abs(candidate.x - player.x) <= 1/player.fov * 800 + candidate.size && Math.abs(candidate.y - player.y) <= 1/player.fov * 450 + candidate.size){ // make sure player is in fov
					let playerPack = {};
					if(!player.inFov.includes(candidate)){
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
					if (Object.keys(playerPack).length > 0){
						playerUpdatePacks.push(playerPack);
					}
				} else {
					if(player.inFov.includes(candidate)){
						player.inFov.splice(player.inFov.indexOf(candidate), 1);
						playerUpdatePacks.push({
							g: candidate.gameId,
							ip: -1
						});
					}
				}
			}
			let sendEnergy = player.changed["energy"];
			let sendHealth = player.changed["health"];


      const payLoad = {
        t: "u",
        p: playerUpdatePacks
      };
      if (sendEnergy){
        payLoad.e = player.energy;
      }
      if (sendHealth){
        payLoad.h = player.hp;
      }
      player.ws.send(msgpack.encode(payLoad));
    }
		for(let p of Object.keys(arena.players)){
      arena.players[p].changed = {}; // reset changed properties
		}
  }
}

module.exports = { update, sendToPlayers }