import { ConvertIdToTower } from "./utils/towerCast.js";

export class Tower{
  constructor(gameData){
    this.x = gameData.x;
    this.y = gameData.y;
    this.type = ConvertIdToTower[gameData.tt];
		this.size = gameData.s;
    this.dir = gameData.d;
    this.id = gameData.id;
    this.parentId = gameData.pi;
    this.hp = gameData.hp;
    this.maxHP = gameData.mh;
    this.size = gameData.s;
    this.baseSize = this.size;
    this.animation = 0;
    this.team = gameData.tm;
		if(gameData.a != undefined){
			this.animation = gameData.a;
		}
    if (gameData.ar != undefined){
      this.auraRadius = gameData.ar;
      this.auraDir = 0;
    }
    else{
      this.auraRadius = 0;
    }
  }
  updatePack(updatePack){
    if (updatePack.d != undefined){
      this.dir = updatePack.d;
    }
    if (updatePack.hp != undefined){
      this.hp = updatePack.hp;
    }
    if (updatePack.a != undefined){
      this.animation = updatePack.a;
			if(this.type == "volcano"){
      	this.size = this.baseSize + this.animation/2;
			}
    }
  }
}