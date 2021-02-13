const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");
const { TowerStats, ElementStats } = require("./stats");
const { ttToStr, strToTt } = require("./utils/ttcast");

class Tower {
  constructor(id, parentId, x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
		this.size = TowerStats[this.type].size || 80;
		this.dir = 0;
    this.id = id;
    this.parentId = parentId; // gameId of parent
    this.hp = TowerStats[this.type].hp || 200;
    this.maxHP = this.hp;
    this.decay = (TowerStats[this.type].decay)/1000;

		this.seenBy = []; // clients who've seen the tower

		this.changed = {};
  }
  update(delta){
    this.hp -= this.decay * delta;
  }
  getInitPack(){
    return {
      tt: strToTt[this.type],
			x: this.x,
			y: this.y,
			s: this.size,
      id: this.id,
      pi: this.parentId,
			d: this.dir,
      hp: this.hp,
      mh: this.maxHP
    }
  }
	getUpdatePack(){
		let pack = {};
    for(let i of Object.keys(this.changed)){
      if (i === "d"){
        pack.d = Math.round(this.dir*10)/10;
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

		// game properties
		this.keys = []; // keys pressed
		this.changed = {}; // properties that changed
		this.inFov = []; // players inside fov

		this.x;
		this.y;
		this.xv;
		this.yv;
		this.size;

    this.element;
    this.energy;
    this.lastEnergy;

		this.stats = ElementStats["basic"];
    this.fov = 1;

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

		let whitelist = ["name", "x", "y", "gameId", "fov", "element", "size"];

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
			width: client.size,
      height: client.size,
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

module.exports = { Client, Arena, Tower }