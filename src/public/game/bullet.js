let numToType = {
  "0": "basic",
	"1": "bomb",
	"2": "water"
}
export class Bullet{
  constructor(gameData){
    this.x = gameData.x;
    this.y = gameData.y;
    this.id = gameData.id;
    this.type = numToType[gameData.t];
    this.size = gameData.s;
    this.parentId = gameData.pi;
    this.midX = this.x;
    this.midY = this.y;
    this.serverX = this.x;
    this.serverY = this.y;
    this.opacity = 1;
    this.lastX = this.serverX;
    this.lastY = this.serverY;
    this.baseSize = this.size;
  }
  updatePack(gameData){
    if (gameData.s){
      this.size = gameData.s;
    }
    this.lastX = this.serverX;
    this.lastY = this.serverY;
    this.serverX = gameData.x;
    this.serverY = gameData.y;
  }
}
