export class Player{
  constructor(gameData){
    if (gameData.g != undefined){
      //Create player (not you)
      this.gameId = gameData.g;
      this.name = gameData.n;
      this.size = gameData.s;
      this.element = gameData.e;
      this.x = gameData.x;
      this.y = gameData.y;
    }
    else{
      //Create player (is you)
      this.name = gameData.name;
      this.x = gameData.x;
      this.y = gameData.y;
      this.gameId = gameData.gameId;
      this.fov = gameData.fov;
      this.element = gameData.element;
      this.size = gameData.size;
      this.energy = 0;
      this.maxEnergy = 100;
      this.slots = ["farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic", "farm", "basic"]
      this.hp = 0;
      this.maxHP = 100;
    }
  }
  updatePack(updatePack){
    if (updatePack.x){
      this.x = updatePack.x;
    }
    if (updatePack.y){
      this.y = updatePack.y;
    }
  }
}
