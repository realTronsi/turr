const ConvertIdToTower = {
  "0": "farm",
  "1": "basic",
  "2": "heal"
}

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
  }
  updatePack(updatePack){
    if (updatePack.d != undefined){
      this.dir = updatePack.d;
    }
    if (updatePack.hp != undefined){
      this.hp = updatePack.hp;
    }
  }
}