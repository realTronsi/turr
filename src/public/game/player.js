const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
import { fitText } from "./utils.js";

export class Player{
  constructor(gameData){
    if (gameData.g != undefined){
      //Create player (not you)
      this.gameId = gameData.g;
      this.name = gameData.n;
      this.size = gameData.s;
      this.element = gameData.e;
      this.x = Infinity;
      this.y = Infinity;
      this.serverX = Infinity;
      this.serverY = Infinity;
      this.middleX = Infinity;
      this.middleY = Infinity;
      ctx.font = "20px Arial";
      this.name = fitText(ctx, this.name, 300);
    }
    else{
      //Create player (is you)
      this.name = gameData.name;
      this.x = gameData.x;
      this.y = gameData.y;
      this.serverX = gameData.x;
      this.serverY = gameData.y;
      this.middleX = gameData.x;
      this.middleY = gameData.y;
      this.gameId = gameData.gameId;
      this.fov = gameData.fov;
      this.element = gameData.element;
      this.size = gameData.size;
      this.energy = 100;
      this.maxEnergy = 100;
      this.slots = ["farm", "basic"]
      this.hp = 100;
      this.maxHP = 100;
    }
  }
  updatePack(updatePack){
    if (updatePack.x != undefined){
      this.serverX = updatePack.x;
    }
    if (updatePack.y != undefined){
      this.serverY = updatePack.y;
    }
    if (updatePack.ip === 0){
      this.x = this.serverX;
      this.y = this.serverY;
      this.middleX = this.x;
      this.middleY = this.y;
    }
    if (updatePack.ip === -1){
      this.x = Infinity;
      this.y = Infinity;
      this.serverX = Infinity;
      this.serverY = Infinity;
      this.middleX = Infinity;
      this.middleY = Infinity;
    }
    
  }
}
