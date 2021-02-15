export class Bullet{
  constructor(gameData){
    this.x = gameData.x;
    this.y = gameData.y;
    this.id = gameData.id;
    this.type = gameData.t;
    this.size = gameData.s;
    this.parentId = gameData.pi;
    this.midX = this.x;
    this.midY = this.y;
    this.serverX = this.x;
    this.serverY = this.y;
    this.opacity = 1;
    this.lastX = this.serverX;
    this.lastY = this.serverY;
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
/*
  getInitPack(){
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      t: this.type,
      pi: this.parentId,
      s: this.size
    }
  }
  getUpdatePack(){
    const pack = {
      id: this.id,
      x: this.x,
      y: this.y
    };
    if (this.changed["s"]){
      pack.s = this.size;
    }
    return pack;
  }
  getRemovePack(){
    return {
      rem: 1,
      id: this.id
    };
  }
  */