const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
import { fitText } from "./utils/utils.js";
import { etToStr } from "./utils/elementCast.js";
import { ElementTiers } from "./utils/tierList.js";

export class Player{
  constructor(gameData){
    console.log(gameData)
    if (gameData.g != undefined){
      //Create player (not you)
      this.gameId = gameData.g;
      this.name = gameData.n;
      this.size = gameData.s;
      this.id = gameData.g;
      this.element = gameData.e;
      this.x = Infinity;
      this.y = Infinity;
      this.serverX = Infinity;
      this.serverY = Infinity;
      this.middleX = Infinity;
      this.middleY = Infinity;
      if (gameData.t != undefined && gameData.t != null){
        this.team = gameData.t;
        this.inteam = true;
      }
      else{
        this.team = this.gameId;
        this.inteam = false;
      }
      this.chatMessage = gameData.m || "";
      this.chatDeletion = false;
      if (this.chatMessage != ""){
        this.chatOpacity = 1;
      }
      else{
        this.chatOpacity = 0;
      }
      ctx.font = "20px Arial";
      this.name = fitText(ctx, this.name, 300);
      ctx.font = "25px Arial";
      this.shortName = fitText(ctx, this.name, 160);
    }
    else{
      //Create player (is you)
      this.xp = gameData.xp;
      this.toFov = 1;
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
      this.midenergy = 100;
      this.svrenergy = 100;

      this.chatMessage = "";
      this.chatOpacity = 0;
      this.chatDeletion = false;

      if (gameData.team != undefined && gameData.team != null){
        this.team = gameData.team;
        this.inteam = true;
      }
      else{
        this.team = this.gameId;
        this.inteam = false;
      }

      
      this.maxEnergy = 100;
      this.slots = ["farm", "basic", "heal"]
      this.hp = 100;
      this.midhp = 100;
      this.svrhp = 100;
      this.maxHP = 100;
      this.id = gameData.gameId;
      ctx.font = "25px Arial";
      this.shortName = fitText(ctx, this.name, 160);
      this.redFlash = 0;
    }
  }
  updatePack(updatePack){
    if (updatePack.sp != undefined){
      this.spawnProt = updatePack.sp;
    }
    if (updatePack.x != undefined){
      this.serverX = updatePack.x;
    }
    if (updatePack.y != undefined){
      this.serverY = updatePack.y;
    }
    if (updatePack.xp != undefined){
      this.xp = updatePack.xp;
    }
    if (updatePack.isd != undefined){
      this.redFlash = 1;
    }
    if (updatePack.fov != undefined){
      this.toFov = updatePack.fov;
    }
    if (updatePack.el != undefined){
      this.element = etToStr[updatePack.el];
      this.toFov = ElementTiers[this.element].fov;
      this.maxHP = ElementTiers[this.element].maxHP;
      this.maxEnergy = ElementTiers[this.element].maxEnergy;
      this.slots = ElementTiers[this.element].towers;
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
      this.spawnProt = 0;
    }
    
  }
}
