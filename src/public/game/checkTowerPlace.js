const canvas = document.getElementById("gameCanvas");
import { TowerStats } from "./utils/energyStats.js";


export function checkTowerPlace(gameData, rawmouse, held){
  //Get all players in 1 object
	let players = JSON.parse(JSON.stringify(gameData.players));
	players[gameData.you.gameId] = JSON.parse(JSON.stringify(gameData.you));
  let mouse = {x: 0, y: 0}
  mouse.x = (rawmouse.x - canvas.width/2)/gameData.you.fov + gameData.you.x;
  mouse.y = (rawmouse.y - canvas.height/2)/gameData.you.fov + gameData.you.y;
  
  for (let id of Object.keys(players)) {
		const player = players[id];
    //Check players
    if (Math.sqrt(
      Math.pow(
        mouse.x - player.x, 2 
      ) + Math.pow(
        mouse.y - player.y, 2) 
    ) < 40 + player.size){
      return false;
    }
	}
  for (let id of Object.keys(gameData.towers)) {
		const tower = gameData.towers[id];
    //Check towers
    if (Math.sqrt(
      Math.pow(
        mouse.x - tower.x, 2) + 
      Math.pow(
        mouse.y - tower.y, 2) 
    ) < tower.size/2 + 40){
      return false;
    }
	}
  //Check borders of Arena
  if (mouse.x < 40){
    //Left
    return false;
  }
  if (mouse.y < 40){
    //Top
    return false;
  }
  if (mouse.x > gameData.arenaWidth-40){
    //Right
    return false;
  }
  if (mouse.y > gameData.arenaHeight-40){
    //Bottom
    return false;
  }
  //Check if you have enough energy
  if (gameData.you.energy < TowerStats[held].energy){
    return false;
  }
  //Check if you are gonna place a tower out of a certain distance from yourself
  if (Math.sqrt(Math.pow(mouse.x-gameData.you.x, 2)+Math.pow(mouse.y-gameData.you.y, 2)) > 400){
    return false;
  }
  return true;
}