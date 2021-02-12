const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");

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
		this.changed = []; // properties that changed

		this.x;
		this.y;
		this.xv;
		this.yv;
		this.size;

    this.element;
    this.energy;
    this.lastEnergy;

		this.stats = {
			speed: 11,
			attack: 1,
			defense: 100, // health
      friction: 0.5,
      maxEnergy: 100
		}
    this.fov = 1;

    this.hp;
  }
  getInitPack(){
    return {
      g: this.gameId,
      n: this.name,
      s: this.size,
      e: this.element,
      x: this.x,
      y: this.y
    }
  }
  getUpdatePack(){
    let pack = {};
    for(let i of this.changed){
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
		this.playerCount = 0; // # of players
    this.gameIdCount = 0;
    this.width = width || 2000;
    this.height = height || 2000;

		this.playerqt = new Quadtree({
      width: this.width,
    	height: this.height,
      maxElements: 5
    });
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
    client.energy = 0;
    client.lastEnergy = 0;
    client.hp = 0;
    client.arena = this.id;

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
    this.players[client.id] = client;
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

module.exports = { Client, Arena }