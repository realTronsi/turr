const serverTick = 45;
function lerp(start, end, time) {
	return start * (1 - time) + end * time;
}
export function Update(gameData, delta){
  for(let i of Object.keys(gameData.players)){
    const player = gameData.players[i];
    player.x = lerp(player.x, player.middleX, delta/1000*serverTick)
    player.y = lerp(player.y, player.middleY, delta/1000*serverTick)
    player.middleX = lerp(player.middleX, player.serverX, delta/1000*serverTick)
    player.middleY = lerp(player.middleY, player.serverY, delta/1000*serverTick)
  }
  if(true){
    const player = gameData.you;
    player.x = lerp(player.x, player.middleX, delta/1000*serverTick)
    player.y = lerp(player.y, player.middleY, delta/1000*serverTick)
    player.middleX = lerp(player.middleX, player.serverX, delta/1000*serverTick)
    player.middleY = lerp(player.middleY, player.serverY, delta/1000*serverTick)
  }
  
}