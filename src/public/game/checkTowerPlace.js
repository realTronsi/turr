const canvas = document.getElementById("gameCanvas");
import { TowerStats } from "./utils/energyStats.js";


export function checkTowerPlace(gameData, mouse, held){
  //Get all players in 1 object
	let players = JSON.parse(JSON.stringify(gameData.players));
	players[gameData.you.gameId] = JSON.parse(JSON.stringify(gameData.you));
  for (let id of Object.keys(players)) {
		const player = players[id];
    //Check players
    if (Math.sqrt(
      Math.pow(
        mouse.x - ((player.x-gameData.you.x)*gameData.you.fov + canvas.width/2), 2) + 
      Math.pow(
        mouse.y - ((player.y-gameData.you.y)*gameData.you.fov + canvas.height/2), 2) 
    ) < 40 + player.size){
      return false;
    }
	}
  for (let id of Object.keys(gameData.towers)) {
		const tower = gameData.towers[id];
    //Check towers
    if (Math.sqrt(
      Math.pow(
        mouse.x - ((tower.x-gameData.you.x)*gameData.you.fov + canvas.width/2), 2) + 
      Math.pow(
        mouse.y - ((tower.y-gameData.you.y)*gameData.you.fov + canvas.height/2), 2) 
    ) < tower.size){
      return false;
    }
	}
  //Check borders of Arena
  if (mouse.x - ((0 - gameData.you.x)*gameData.you.fov + canvas.width/2) < 40){
    //Left
    return false;
  }
  if (mouse.y - ((0 - gameData.you.y)*gameData.you.fov + canvas.height/2) < 40){
    //Top
    return false;
  }
  if (mouse.x - ((gameData.arenaWidth - gameData.you.x)*gameData.you.fov + canvas.width/2) > -40){
    //Right
    return false;
  }
  if (mouse.y - ((gameData.arenaHeight - gameData.you.y)*gameData.you.fov + canvas.height/2) > -40){
    //Bottom
    return false;
  }
  //Check if you have enough energy
  if (gameData.you.energy < TowerStats[held].energy){
    return false;
  }
  //Check if you are gonna place a tower out of a certain distance from yourself
  if (Math.sqrt(Math.pow(mouse.x-canvas.width/2, 2)+Math.pow(mouse.y-canvas.height/2, 2)) > 400){
    return false;
  }
  return true;
}