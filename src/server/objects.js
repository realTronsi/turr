const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");
const { TowerStats, ElementStats } = require("./stats");
const { ttToStr, strToTt } = require("./utils/ttcast");

class Bullet {
  constructor(id, parentId, x, y, dir, stats){
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.parentId = parentId;
		this.type = stats.type;
    this.damage = stats.damage;
    this.speed = stats.speed / 1000;
    this.hp = stats.hp;
    this.size = stats.size;
    this.decay = stats.decay / 1000;
    this.xv = Math.cos(this.dir) * this.speed;
    this.yv = Math.sin(this.dir) * this.speed;
    //Offset location so it spawns at the end of the turret out of the tower
    this.x += Math.cos(this.dir) * 20;
    this.y += Math.sin(this.dir) * 20;
    //Changed attributes
    this.changed = {};
    this.seenBy = []; //Clients who are seeing the bullet


  }
  getInitPack(){
    return {
      i: this.id,
      x: Math.round(this.x),
      y: Math.round(this.y),
      t: this.type,
      pi: this.parentId,
      s: this.size
    }
  }
  getUpdatePack(){
    const pack = {
      i: this.id,
      x: Math.round(this.x),
      y: Math.round(this.y)
    };
    if (this.changed["s"]){
      pack.s = this.size;
    }
    return pack;
  }
  getRemovePack(){
    return {
      rem: 1,
      i: this.id
    };
  }
  
}

class Tower {
  constructor(id, parentId, x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
		this.size = (TowerStats[this.type].size || 80);
		this.dir = 0;
    this.id = id;
    this.parentId = parentId; // gameId of parent
    this.hp = TowerStats[this.type].hp || 200;
		this.range = TowerStats[this.type].range || 0;
		this.maxReload = TowerStats[this.type].reload;
		this.reload = this.maxReload * 1/3;
    this.maxHP = this.hp;
    this.decay = (TowerStats[this.type].decay)/1000;

		if(this.type == "heal"){
			this.radius = TowerStats["heal"].radius;
			this.effect = TowerStats["heal"].effect;
		}
    if(this.type == "farm"){
      this.effect = TowerStats["farm"].effect;
    }

		this.seenBy = []; // clients who've seen the tower

		this.changed = {};
  }
  getInitPack(){
		let pack = {
      tt: strToTt[this.type],
			x: Math.round(this.x),
			y: Math.round(this.y),
			s: this.size * 2,
      id: this.id,
      pi: this.parentId,
			d: this.dir,
      hp: this.hp,
      mh: this.maxHP
    }
		if(this.type == "heal"){
			pack.ar = this.radius;
		}
    return pack;
  }
	getUpdatePack(){
		let pack = {};
    for(let i of Object.keys(this.changed)){
      if (i === "d"){
        pack.d = Math.round(this.dir*100)/100;
      }
    }
    pack.hp = Math.round(this.hp);
    pack.id = this.id;
    return pack;
	}
}

class Client {
  constructor(ws, id){
    this.ws = ws;
    this.id = id;
    this.gameId;
    this.name;
		this.state = "menu"; // state of client (joining server, ingame, dead, etc.)

		this.arenaId; // arena playr is in

    this.isDamaged = false;

		// game properties
		this.keys = []; // keys pressed
		this.changed = {}; // properties that changed
		this.inFov = []; // players inside fov

		this.x;
		this.y;
		this.xv;
		this.yv;
		this.size;
    this.xp;

    this.element;
    this.energy;
    this.lastEnergy;

		this.stats = ElementStats["basic"];
    this.fov = ElementStats["basic"].fov;

    this.hp;
  }
  getInitPack(){
    return {
      g: this.gameId,
      n: this.name,
      s: this.size,
      e: this.element
    }
  }
  getUpdatePack(){
    let pack = {};
    for(let i of Object.keys(this.changed)){
      if (i === "x"){
        pack.x = Math.round(this.x*10)/10;
      }
      if (i === "y"){
        pack.y = Math.round(this.y*10)/10;
      }
    }
    if (this.isDamaged){
      pack.isd = true;
    }
    if (Object.keys(pack).length > 0){
      pack.g = this.gameId;
    }
    return pack;
  }
}

class Arena {
	constructor(id, name, width, height, maxPlayers){
    this.id = id;
		this.name = name;
    this.maxPlayers = maxPlayers;
		this.players = {};
    this.towers = {};
    this.bullets = {};
		this.playerCount = 0; // # of players
    this.gameIdCount = 0;
    this.width = width || 2000;
    this.height = height || 2000;

		this.playerqt = new Quadtree({
      width: this.width,
    	height: this.height,
      maxElements: 5
    });
    this.towerqt = new Quadtree({
      width: this.width,
      height: this.height,
      maxElements: 5
    })
	}
	getSelectionData(){
		return {
			"id": this.id,
			"title": (this.name + ` (${this.playerCount}/${this.maxPlayers})`)
		}
	}
	createId(){
		// loop thru all clients and push their game id in an array, then just loop thru array 
		let gameId;
    let idArray = [];
		for(let i of Object.keys(this.players)){
      const player = this.players[i];
      idArray.push(player.gameId);
    }
    for(let i of Object.keys(this.towers)){
      const tower = this.towers[i];
      idArray.push(tower.parentId);
    }
    for(let i of Object.keys(this.bullets)){
      const bullet = this.bullets[i];
      idArray.push(bullet.parentId);
    }
    for(let i=0; i<this.maxPlayers; i++){
			if(!idArray.includes(i)){
				gameId = i;
				break;
			}
		}
		return gameId;
	}
	createTowerId(){
		let towerId = 0;
    let idArray = [];
		for(let i of Object.keys(this.towers)){
      const tower = this.towers[i];
      idArray.push(tower.id);
    }
    while(true){
			if(!idArray.includes(towerId)){
				break;
			}
      towerId++;
		}
		return towerId;
	}
  createBulletId(){
		let bulletId = 0;
    let idArray = [];
		for(let i of Object.keys(this.bullets)){
      const bullet = this.bullets[i];
      idArray.push(bullet.id);
    }
    while(true){
			if(!idArray.includes(bulletId)){
				break;
			}
      bulletId++;
		}
		return bulletId;
  }
	addPlayer(client){
		// loop thru and send everyone the new player first no put it first since we dont want to include the new player himself
		client.state = "game";
		client.gameId = this.createId();
    client.yv = 0;
    client.xv = 0;
    client.size = 20;
    client.x = (Math.random() * this.width - client.size * 2) + client.size;
    client.y = (Math.random() * this.height - client.size * 2) + client.size;
    client.element = "basic";
    client.energy = 100;
    client.lastEnergy = 100;
    client.hp = 100;
    client.arenaId = this.id;
    client.xp = 0;

		const payLoad = {
			t: "npj", // new player joined
      i: client.getInitPack()
		}
		
    let initPacks = [];
    for(let i of Object.keys(this.players)){
      const player = this.players[i];
      //send new client data to players
      player.ws.send(msgpack.encode(payLoad));
      //add player data to payLoad
      initPacks.push(player.getInitPack());
    } 

        
		let self_data = JSON.parse(JSON.stringify(client));

		let whitelist = ["name", "x", "y", "gameId", "fov", "element", "size", "xp"];

		for(let p in Object.keys(self_data)){ // whitelist properties to send and remove unnecessary ones
			if(!whitelist.includes(p)){
				delete self_data[p];
			}
		}

		// send data to new client
    const payLoad2 = {
      t: "jss", // join server successful
      pd: initPacks, // player data
      s: self_data, //Self
      aW: this.width,
      aH: this.height
    };
    client.ws.send(msgpack.encode(payLoad2));

    //Add new player
    this.players[client.gameId] = client;
		this.playerqt.push({
      x: client.x-client.size,
      y: client.y-client.size,
			width: client.size * 2,
      height: client.size * 2,
      gameId: client.gameId
    });

		this.playerCount++;
	}
  static getAllSelectionData(arenas){
    let data = [];
    for(let i of Object.keys(arenas)){
      const arena = arenas[i];
      data.push(arena.getSelectionData());
    }
    return data;
  }
}

module.exports = { Client, Arena, Tower, Bullet }