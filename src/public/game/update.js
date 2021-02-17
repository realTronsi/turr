const serverTick = 30;
function lerp(start, end, time) {
	return start * (1 - time) + end * time;
}
export function Update(gameData, delta, gameMessages){
  for(let i of Object.keys(gameData.bullets)){
    const bullet = gameData.bullets[i];
    if (bullet.opacity < 1){
      bullet.opacity -= 0.08;
      bullet.size += 0.5;
      bullet.serverX += bullet.dx/serverTick;
      bullet.serverY += bullet.dy/serverTick;
    }
    if (bullet.opacity < 0){
      delete gameData.bullets[i];
    }
  }
  for(let i of Object.keys(gameData.players)){
    const player = gameData.players[i];
    player.x = lerp(player.x, player.middleX, delta/1000*serverTick)
    player.y = lerp(player.y, player.middleY, delta/1000*serverTick)
    player.middleX = lerp(player.middleX, player.serverX, delta/1000*serverTick)
    player.middleY = lerp(player.middleY, player.serverY, delta/1000*serverTick)

    player.redFlash += (-0.1 - player.redFlash)/20;
  }
  if(true){
    const player = gameData.you;
    player.x = lerp(player.x, player.middleX, delta/1000*serverTick)
    player.y = lerp(player.y, player.middleY, delta/1000*serverTick)
    player.middleX = lerp(player.middleX, player.serverX, delta/1000*serverTick)
    player.middleY = lerp(player.middleY, player.serverY, delta/1000*serverTick)
    player.hp = lerp(player.hp, player.midhp, delta/1000*serverTick);
    player.midhp = lerp(player.midhp, player.svrhp, delta/1000*serverTick);

    player.energy = lerp(player.energy, player.midenergy, delta/1000*serverTick);
    player.midenergy = lerp(player.midenergy, player.svrenergy, delta/1000*serverTick);
    if (player.energy > player.maxEnergy){
      player.energy = player.maxEnergy;
    }
    if (player.hp > player.maxHP){
      player.hp = player.maxHP;
    }

    player.redFlash += (-0.1 - player.redFlash)/20;
    
    
  }
  for(let i of Object.keys(gameData.bullets)){
    const bullet = gameData.bullets[i];
    bullet.x = lerp(bullet.x, bullet.midX, delta/1000*serverTick)
    bullet.y = lerp(bullet.y, bullet.midY, delta/1000*serverTick)
    bullet.midX = lerp(bullet.x, bullet.serverX, delta/1000*serverTick)
    bullet.midY = lerp(bullet.y, bullet.serverY, delta/1000*serverTick)
    
  }
}