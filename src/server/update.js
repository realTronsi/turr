const msgpack = require("msgpack-lite");

function update(arenas){ // main game loop
	for(let a of Object.keys(arenas)){
    const arena = arenas[a];


		if(arena.playerCount == 0) continue;
    
    let updatePacks = [];
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

      
			player.changed = []; // reset changed properties

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


			player.xv *= player.stats.friction;
			player.yv *= player.stats.friction;

      
      if (Math.abs(player.xv) < 0.06){
        player.xv = 0;
      }
      if (Math.abs(player.yv) < 0.06){
        player.yv = 0;
      }

      if (player.xv != 0){
        player.changed.push("x");
      }
      if (player.yv != 0){
        player.changed.push("y");
      }
      
      player.x += player.xv;
      player.y += player.yv;

			// WALL COLLISION
      let lastX = player.x;
      let lastY = player.y;
      player.x = Math.min(Math.max(player.x, player.size), arena.width-player.size)
      player.y = Math.min(Math.max(player.y, player.size), arena.height-player.size)
      if (lastX != player.x){
        player.changed.push("x");
      }
      if (lastY != player.y){
        player.changed.push("y");
      }
      
    }
    for(let p of Object.keys(arena.players)){
      //Add Update Pack
			const player = arena.players[p];
      let playerPack = player.getUpdatePack();
      if (Object.keys(playerPack).length > 0){
        updatePacks.push(playerPack);
      }
    }
    for(let p of Object.keys(arena.players)){
      const player = arena.players[p];
			let sendEnergy = true; // send energy if energy isn't full
			if(player.energy >= player.stats.maxEnergy){
				sendEnergy = false;
			}
			player.energy += 1/2;
      if (player.energy > player.stats.maxEnergy){
        player.energy = player.stats.maxEnergy;
      }
      let sendHealth = true; // send health
			if(player.hp >= player.stats.defense){
				sendHealth = false;
			}
			player.hp += 1/6;
      if (player.hp > player.stats.defense){
        player.hp = player.stats.defense;
      }
      
      const payLoad = {
        t: "u",
        p: updatePacks
      };
      if (sendEnergy){
        payLoad.e = player.energy;
      }
      if (sendHealth){
        payLoad.h = player.hp;
      }
      player.ws.send(msgpack.encode(payLoad));
    }


  }
}

module.exports = { update }