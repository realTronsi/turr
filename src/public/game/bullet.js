let numToType = {
  "0": "basic",
	"1": "bomb",
	"2": "water",
  "3": "splinter",
  "4": "rock",
  "5": "ice",
  "6": "plasma",
  "7": "electricity",
  "8": "cannonball",
  "9": "beam",
  "10": "poison",
  "11": "air"
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
		this.die = false;
    this.team = gameData.tm;
    if (this.type == "ice" || this.type == "rock" || this.type == "air"){
      this.rotate = Math.random() * 6.28;
    }
    else{
      this.rotate = 0;
    }
    if (this.type == "electricity"){
      this.nodes = gameData.nd;
			this.opacity = 0.7;
    }
    if (this.type == "beam"){
      this.start = gameData.s;
      this.end = gameData.e;
      this.width = gameData.w;

      this.laserAngle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
      this.midAngle = this.laserAngle;
      this.svrAngle = this.laserAngle;

      this.laserLength = Math.sqrt(Math.pow(this.start.x - this.end.x, 2) + Math.pow(this.start.y - this.end.y, 2));
    }

  }
  updatePack(gameData){
    if (gameData.s){
      this.size = gameData.s;
    }
    this.lastX = this.serverX;
    this.lastY = this.serverY;
    if (gameData.x != undefined){
      this.serverX = gameData.x;
    }
    if (gameData.y != undefined){
      this.serverY = gameData.y;
    }
    if (gameData.nd != undefined){
      for(let i of gameData.nd){
        this.nodes.push(i);
      }
    }
    if (gameData.s != undefined && this.type == "beam"){
      this.start = gameData.s;
    }
    if (gameData.e != undefined && this.type == "beam"){
      this.svrAngle = Math.atan2(gameData.e.y - this.start.y, gameData.e.x - this.start.x);
      this.laserLength = Math.sqrt(Math.pow(this.start.x - gameData.e.x, 2) + Math.pow(this.start.y - gameData.e.y, 2));
    }
    
  }
}
