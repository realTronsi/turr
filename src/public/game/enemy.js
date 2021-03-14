import { enToStr } from "./utils/enemyCast.js";

export class Enemy{
  constructor(gameData){
    this.id = gameData.i;
    this.x = gameData.x;
    this.y = gameData.y;
    this.svrX = gameData.x;
    this.svrY = gameData.y;
    this.midX = gameData.x;
    this.midY = gameData.y;
    
    this.type = enToStr[gameData.et];
		this.size = gameData.s;
    this.hp = gameData.hp;
    this.maxHP = gameData.maxHP;
    this.dir = 0;
  }
  updatePack(updatePack){
    if (updatePack.x != undefined){
      this.svrX = updatePack.x;
    }
    if (updatePack.y != undefined){
      this.svrY = updatePack.y;
    }
    if (updatePack.hp != undefined){
      this.hp = updatePack.hp;
    }
    if (updatePack.d != undefined){
      this.dir = updatePack.d;
    }
  }
}