const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");
const { TowerStats, ElementStats, EnemyStats } = require("./stats");
const { DefenseTowerStats } = require("./defensestats");
const { ttToStr, strToTt } = require("./utils/ttcast");
const { etToStr, strToEt } = require("./utils/etcast")
const { strToEn } = require("./utils/encast");
const { ksCalc } = require("./utils/ksCalc.js");
const { spawnPoint } = require("./utils/spawn.js");
const uuid = require("uuid");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

fix ranged enemy targetting first b4 antyhing, rn its just targetting a player if its in range which is nono

class Enemy {
  constructor(id, x, y, type) {
    this.id = id;
    this.x = x;
    this.y = y;

		this.xv = 0;
		this.yv = 0;
		this.bxv = 0;
		this.byv = 0;
		
    this.team = -1;
    this.parentId = -1;
    this.type = type;
    this.dir = 0;
    this.hp = EnemyStats[this.type].hp;
    this.maxHP = EnemyStats[this.type].hp;
    this.size = EnemyStats[this.type].size;
    this.damage = EnemyStats[this.type].damage;
    this.speed = EnemyStats[this.type].speed;
    this.range = EnemyStats[this.type].range;
    this.reward = EnemyStats[this.type].reward;

		this.bfric = 0.88 * Math.max(Math.min(30 / this.size, 1), 0.81);

    this.boostxv = 0;
    this.boostyv = 0;
    this.boostfric = 0.88;

    this.stats = EnemyStats[this.type];
    if (this.stats.reload){
      this.maxReload = this.stats.reload;
      this.reload = 0;
    }
    if (this.stats.reload2){
      this.maxReload2 = this.stats.reload2;
      this.reload2 = this.stats.reloadoffset2 || 0;
    }
    if (this.stats.reload3){
      this.maxReload3 = this.stats.reload3;
      this.reload3 = 0;
    }

    this.seenBy = [];
    this.effects = {
      drowned: 100,
			frozen: 0,
      poison: null
    };

    this.changed = {};
  }
  getInitPack() {
    let pack = {
      i: this.id,
      x: Math.round(this.x),
      y: Math.round(this.y),
      et: strToEn[this.type],
      s: this.size,
      hp: Math.round(this.hp),
      maxHP: this.maxHP,
      init: 1
    }
    return pack;
  }
  getUpdatePack() {
    let pack = {};
    for (let i of Object.keys(this.changed)) {
      if (i == "x") {
        pack.x = Math.round(this.x);
      }
      if (i == "y") {
        pack.y = Math.round(this.y);
      }
      if (i == "hp") {
        pack.hp = Math.round(this.hp);
      }
      if (i == "dir") {
        pack.d = Math.round(this.dir * 100) / 100
      }
    }
    if (Object.keys(pack).length > 0) {
      pack.i = this.id;
    }
    return pack;
  }
  getRemovePack() {
    return {
      rem: 1,
      i: this.id
    };
  }
  die(arena, id) {
    const player = arena.players[id];
    if (player != undefined) {
      player.xp += this.reward;
      player.changed["xp"] = true;
    }
    let thisid = this.id;
    let deleteQtEnemy = arena.enemyqt.find(function(element) {
      return element.id === thisid
    })
    if (deleteQtEnemy.length > 0) {
      arena.enemyqt.remove(deleteQtEnemy[0]);
    }
    const payLoad = {
      t: "re",
      i: thisid
    }
    for (let seenPlayer of this.seenBy) {
      seenPlayer.ws.send(msgpack.encode(payLoad))
    }
    delete arena.enemies[this.id];
  }


}

class Bullet {
  constructor(id, x, y, dir, stats, tower) {
    this.tower = tower;
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.parentId = tower.parentId;
    if (stats.type === "bomb") {
      this.stage = "normal";
    }
    if (stats.type == "plasma") {
      this.stage = "expanding";
    }
    this.stats = JSON.parse(JSON.stringify(stats));
    this.stats.speed /= 1000;
    this.stats.decay /= 1000;
    this.xv = Math.cos(this.dir) * this.stats.speed;
    this.yv = Math.sin(this.dir) * this.stats.speed;
    //Offset location so it spawns at the end of the turret out of the tower
    this.x += Math.cos(this.dir) * 20;
    this.y += Math.sin(this.dir) * 20;
    //Changed attributes
    this.changed = {};
    this.seenBy = []; //Clients who are seeing the bullet
    this.parentStats = tower.parentStats;
    if (tower.team != undefined) {
      this.team = tower.team;
    }

    if (this.parentStats != null){
      this.stats.damage = stats.damage * this.parentStats.attack;
    }
    else{
      this.stats.damage = stats.damage;
    }

    this.basestats = this.stats;
  }
  getInitPack() {
    let typeToNum = {
      "basic": 0,
      "bomb": 1,
      "water": 2,
      "splinter": 3,
      "rock": 4,
      "ice": 5,
      "plasma": 6,
      "electricity": 7,
      "cannonball": 8,
      "beam": 9,
      "poison": 10,
      "air": 11
    }
    let pack = {
      i: this.id,
      x: Math.round(this.x),
      y: Math.round(this.y),
      t: typeToNum[this.stats.type],
      pi: this.parentId,
      s: Math.round(this.stats.size),
    };
    if (this.team != undefined) {
      pack.tm = this.team;
    }
    if (this.stats.type == "electricity") {
      pack = {
        i: this.id,
        t: typeToNum[this.stats.type],
        pi: this.parentId
      }
      pack.nd = [];
      // electricity branches will be a new bullet
      for (let i = this.stats.nodes.length; i > 0; i--) {
        pack.nd.push({
          x: this.stats.nodes[this.stats.nodes.length - i].x,
          y: this.stats.nodes[this.stats.nodes.length - i].y
        });
      }
    }
    if (this.stats.type == "beam") {
      pack = {
        i: this.id,
        t: typeToNum[this.stats.type],
        pi: this.parentId,
        s: this.stats.start,
        e: this.stats.end,
        w: this.stats.size
      }
    }
    return pack;
  }
  getUpdatePack() {
    const pack = {
    };
    if (this.changed["x"]) {
      pack.x = Math.round(this.x);
    }
    if (this.changed["y"]) {
      pack.y = Math.round(this.y);
    }
    if (this.changed["s"]) {
      pack.s = Math.round(this.stats.size);
    }
    if (this.changed["nodes"] != null) {
      pack.nd = [];
      // electricity branches will be a new bullet
      for (let i = this.changed["nodes"]; i > 0; i--) {
        pack.nd.push({
          x: this.stats.nodes[this.stats.nodes.length - i].x,
          y: this.stats.nodes[this.stats.nodes.length - i].y
        });
      }
    }
    if (this.changed["start"]) {
      pack.s = this.stats.start;
    }
    if (this.changed["end"]) {
      pack.e = this.stats.end;
    }
    if (Object.keys(pack).length > 0) {
      pack.i = this.id;
    }
    return pack;
  }
  getRemovePack() {
    return {
      rem: 1,
      i: this.id
    };
  }

}

class Tower {
  constructor(id, parent, x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = (DefenseTowerStats[this.type].size || TowerStats[this.type].size);
    this.dir = 0;
    this.id = id;
    this.parentStats = JSON.parse(JSON.stringify(parent.stats));
    this.parentId = parent.gameId;
    this.hp = DefenseTowerStats[this.type].hp || TowerStats[this.type].hp || 200;
    this.range = DefenseTowerStats[this.type].range || TowerStats[this.type].range || 0;
    this.maxReload = DefenseTowerStats[this.type].reload || TowerStats[this.type].reload;
    this.reload = this.maxReload * 1 / 3;
    this.maxHP = this.hp;
    this.decay = (DefenseTowerStats[this.type].decay || TowerStats[this.type].decay) / 1000;
    this.collide = DefenseTowerStats[this.type].collide || TowerStats[this.type].collide;
		this.bullets = DefenseTowerStats[this.type].bullets || TowerStats[this.type].bullets;
    if (parent.team != undefined) {
      this.team = parent.team;
    }

    if (["heal", "drown"].includes(this.type)) {
      this.radius = DefenseTowerStats[this.type].radius || TowerStats[this.type].radius;
      this.effect = DefenseTowerStats[this.type].effect || TowerStats[this.type].effect;
    }

    if (["farm", "propel", "drown", "observatory"].includes(this.type)) {
      this.effect = DefenseTowerStats[this.type].effect || TowerStats[this.type].effect;
    }

    if (["volcano"].includes(this.type)) {
      this.state = DefenseTowerStats[this.type].state || TowerStats[this.type].state;
    }

    if (this.type == "laser") {
      this.spinSpeed = DefenseTowerStats[this.type].spinSpeed || TowerStats[this.type].spinSpeed;
    }

    if (this.type == "volcano") {
      this.explosionTimer = DefenseTowerStats[this.type].explosionTimer || TowerStats[this.type].explosionTimer;
    }

    if (["volcano", "tesla coil"].includes(this.type)) {
      this.animation = 0;
    }

    this.seenBy = []; // clients who've seen the tower

    this.changed = {};
  }
  getInitPack() {
    let pack = {
      tt: strToTt[this.type],
      x: Math.round(this.x),
      y: Math.round(this.y),
      s: this.size * 2,
      id: this.id,
      pi: this.parentId,
      d: Math.round(this.dir * 100) / 100,
      hp: Math.round(this.hp),
      mh: this.maxHP
    }
    if (this.team != undefined) {
      pack.tm = this.team;
    }
    if (this.type == "heal" || this.type == "drown") {
      pack.ar = this.radius;
    }
    if (this.type == "bomb") {
      delete pack.d;
    }
    if (this.type == "volcano" || this.type == "tesla coil") {
      pack.a = this.animation;
    }
    return pack;
  }
  getUpdatePack() {
    let pack = {};
    for (let i of Object.keys(this.changed)) {
      if (i == "d") {
        pack.d = Math.round(this.dir * 100) / 100;
      }
      if (i == "animation") {
        pack.a = this.animation;
      }
    }
    pack.hp = Math.round(this.hp);
    pack.id = this.id;
    return pack;
  }
}

class Client {
  constructor(ws, id) {
    this.ws = ws;
    this.id = id;
    this.gameId;
    this.name;
    this.state = "menu"; // state of client (joining server, game, dead, etc.)

    this.chatMessage = "";
    this.chatTimer = 0;

    this.arenaId; // arena playr is in

    this.isDamaged = false;
    this.killedBy;
    this.spawnProt = 0;

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
    this.tier = 1;
    this.energy;
    this.lastEnergy;

    this.effects = {
      drowned: 100,
      observatory: 0,
      frozen: 0
    };

    this.stats = ElementStats["basic"];
    this.fov = ElementStats["basic"].fov;

    this.hp;
  }
  getInitPack() {
    let pack = {
      g: this.gameId,
      n: this.name,
      s: this.size,
      e: this.element,
      sp: this.spawnProt
    }
    if (this.chatTimer > 0 && this.chatMessage != "") pack.m = this.chatMessage;
    if (this.team != undefined) pack.t = this.team;
    return pack;
  }
  getUpdatePack() {
    let pack = {};
    for (let i of Object.keys(this.changed)) {
      if (i === "x") {
        pack.x = Math.round(this.x * 10) / 10;
      }
      if (i === "y") {
        pack.y = Math.round(this.y * 10) / 10;
      }
      if (i == "element") {
        pack.el = strToEt[this.element];
      }
      if (i == "spawnProt") {
        pack.sp = 0;
      }
      if (i == "fov") {
        pack.fov = this.fov;
      }
      if (i == "poison") {
        pack.pois = 0;
      }
    }
    if (this.isDamaged) {
      pack.isd = true;
    }
    if (Object.keys(pack).length > 0) {
      pack.g = this.gameId;
    }
    return pack;
  }
  die(arena, killerId, name) {
    this.state = "dead";

    let killer = arena.players[killerId];

    let playerid = this.gameId;
    let deleteQtPlayer = arena.playerqt.find(function(element) {
      return element.gameId === playerid
    })
    if (deleteQtPlayer.length > 0) {
      arena.playerqt.remove(deleteQtPlayer[0]);
    }


    if (killer == undefined) {
      killer = {
        name: "???",
        id: null
      }
    }
    if (name != undefined) {
      killer = {
        name: name,
        id: null
      }
    }
    if (killerId == -1){
      killer = {
        name: "Enemy",
        id: null
      }
    }
    
    let payLoad = {
      t: "pd", // player died
      i: this.gameId
    }
    for (let p of Object.keys(arena.players)) {
      let player = arena.players[p];
      if (player != undefined) {
        if (player.inFov.includes(this)) {
          player.inFov.splice(player.inFov.indexOf(this), 1);
          //player.ws.send(msgpack.encode(payLoad));
        }
        player.ws.send(msgpack.encode(payLoad));
      }
    }
    this.killedBy = killer; // player who killed you
    this.adverify = uuid.v4().slice(0, 5); // rewarded vdieo ad verification code
    payLoad = {
      t: "yd", // you died
      n: killer.name, //The pro who kiled u :)
      s: Math.floor(this.xp),
      a: this.adverify
    }
    this.ws.send(msgpack.encode(payLoad));
    if (killer.id != null) {
      // if killer is in game
      payLoad = {
        t: "ykp", // you killed player
        n: this.name // player name
      }
      killer.ws.send(msgpack.encode(payLoad));
      if (killer.state == "game") {
        killer.xp += ksCalc(killer.xp, this.xp);
        killer.changed["xp"] = true;
      }
    }

    // reset stats

    this.xp = Math.pow(this.xp, 0.92);
    if (this.xp > 100000) {
      this.xp = 100000;
    }
    this.stats = ElementStats["basic"];
    this.fov = ElementStats["basic"].fov;
    this.inFov = [];
    if (this.effects.poison != null) {
      this.effects.poison.duration = 0;
      this.effects.poison.reload = Infinity;
    }

    this.yv = 0;
    this.xv = 0;
    this.size = 20;
    this.element = "basic";
    this.tier = 1;
    this.energy = 100;
    this.lastEnergy = 100;
    this.hp = 100;


  }
}

class Arena {
  constructor(id, name, width, height, maxPlayers, gamemode) {
    this.id = id;
    this.name = name;
    if (gamemode.slice(0, 4) == "team") {
      this.nteams = parseInt(gamemode.slice(5));
      this.teams = [];
      for (let i = 0; i < this.nteams; i++) {
        this.teams.push([]);
      }
      gamemode = "team";
    }

    this.gamemode = gamemode;
    this.maxPlayers = maxPlayers;
    this.joinQueue = [];
    this.players = {};
    this.towers = {};
    this.enemies = {};
    this.bullets = {};
    this.playerCount = 0; // # of players
    this.gameIdCount = 0;
    this.width = parseInt(width) || 2000;
    this.height = parseInt(height) || 2000;

		this.zone = -1;

    this.closequeue = [];

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
    this.enemyqt = new Quadtree({
      width: this.width,
      height: this.height,
      maxElements: 4
    })

    if (gamemode == "defense") {
      //Defense mode stuff! C:<
      const towerid = this.createTowerId();

      let tower = new Tower(towerid, {
        stats: {
          attack: 1,
          defense: 100
        },
        gameId: Infinity,
        team: 5
      }, this.width / 2, this.height / 2, "base");

      this.towers[towerid] = tower;

      let towerSize = 400;

      this.towerqt.push({
        x: this.width / 2 - towerSize,
        y: this.width / 2 - towerSize,
        width: towerSize * 2,
        height: towerSize * 2,
        id: towerid,
        parentId: Infinity,
        team: 5
      });

      this.timer = 10;
      this.lastTimer = 60;
      this.betweenWaves = 20;
      this.wave = 0;

      this.spawnAngle = 2.3999632297;

      this.zone = this.width/2 - 1000;



      /*
      this.spawnEnemy(this.width / 2 - 3000, this.height / 2, "normal");
      this.spawnEnemy(this.width / 2 + 3000, this.height / 2, "normal");
      this.spawnEnemy(this.width / 2, this.height / 2 - 3000, "normal");
      this.spawnEnemy(this.width / 2, this.height / 2 + 3000, "normal");
      this.spawnEnemy(this.width / 2 + 3000, this.height / 2 + 3000, "normal");
      this.spawnEnemy(this.width / 2 - 2000, this.height / 2 + 3000, "normal");
      this.spawnEnemy(this.width / 2 - 1000, this.height / 2 - 2000, "normal");
      */

    }

  }
  spawnWaveEnemy(type, number, setX, setY) {
    for (let i = 0; i < Math.floor(number * Math.pow(this.playerCount, 0.85)); i++) {
      let x;
      let y;
      let enemySize = EnemyStats[type].size;

      if (setX == undefined) {
        this.spawnAngle += 2.3999632297;
        x = Math.cos(this.spawnAngle) * (this.zone + enemySize * 5/2) + this.width/2; 
        y = Math.sin(this.spawnAngle) * (this.zone + enemySize * 5/2) + this.height/2;
      }
      else{
        x = setX;
        y = setY;
      }


      let enemyid = this.createEnemyId();

      let enemy = new Enemy(enemyid, x, y, type);

      this.enemies[enemyid] = enemy;


      this.enemyqt.push({
        x: x - enemySize,
        y: y - enemySize,
        width: enemySize * 2,
        height: enemySize * 2,
        id: enemyid,
        team: enemy.team
      })
    }
  }
  spawnEnemy(x, y, type) {
    let enemyid = this.createEnemyId();

    let enemy = new Enemy(enemyid, x, y, type);

    this.enemies[enemyid] = enemy;

    let enemySize = EnemyStats[type].size;

    this.enemyqt.push({
      x: x - enemySize,
      y: y - enemySize,
      width: enemySize * 2,
      height: enemySize * 2,
      id: enemyid,
      team: enemy.team
    })
  }
  getSelectionData() {
    return {
      "id": this.id,
      "title": (this.name + ` (${this.playerCount}/${this.maxPlayers})`)
    }
  }
  announce(msg) {
    for (let i of Object.keys(this.players)) {
      const player = this.players[i];
      const payLoad = {
        t: "ann",
        m: msg
      }
      player.ws.send(msgpack.encode(payLoad))
    }
  }
  createId() {
    // loop thru all clients and push their game id in an array, then just loop thru array 
    let gameId;
    let idArray = [];
    for (let i of Object.keys(this.players)) {
      const player = this.players[i];
      idArray.push(player.gameId);
    }
    for (let i of Object.keys(this.towers)) {
      const tower = this.towers[i];
      idArray.push(tower.parentId);
    }
    for (let i of Object.keys(this.bullets)) {
      const bullet = this.bullets[i];
      idArray.push(bullet.parentId);
    }
    for (let i = 0; i < this.maxPlayers; i++) {
      if (!idArray.includes(i)) {
        gameId = i;
        break;
      }
    }
    return gameId;
  }
  createTowerId() {
    let towerId = 0;
    let idArray = [];
    for (let i of Object.keys(this.towers)) {
      const tower = this.towers[i];
      idArray.push(tower.id);
    }
    while (true) {
      if (!idArray.includes(towerId)) {
        break;
      }
      towerId++;
    }
    return towerId;
  }
  createBulletId() {
    let bulletId = 0;
    let idArray = [];
    for (let i of Object.keys(this.bullets)) {
      const bullet = this.bullets[i];
      idArray.push(bullet.id);
    }
    while (true) {
      if (!idArray.includes(bulletId)) {
        break;
      }
      bulletId++;
    }
    return bulletId;
  }
  createEnemyId() {
    let enemyId = 0;
    let idArray = [];
    for (let i of Object.keys(this.enemies)) {
      const enemy = this.enemies[i];
      idArray.push(enemy.id);
    }
    while (true) {
      if (!idArray.includes(enemyId)) {
        break;
      }
      enemyId++;
    }
    return enemyId;
  }
  addPlayer(client) {
    // loop thru and send everyone the new player first no put it first since we dont want to include the new player himself
    client.state = "game";
    client.gameId = this.createId();
    if (this.gamemode == "team") {
      let weakteam = null;
      let rand = true;
      for (let team of this.teams) {
        if (weakteam == null) {
          weakteam = team;
        }
        if (team.length < weakteam.length) {
          weakteam = team;
          rand = false;
        }
      }
      if (rand) {
        weakteam = this.teams[getRandomInt(0, this.teams.length)];
      }
      client.team = this.teams.indexOf(weakteam);
      weakteam.push(client);
    }

    client.yv = 0;
    client.xv = 0;
    client.size = 20;
    let spawn = spawnPoint(this);
    client.x = spawn.x //(Math.random() * this.width - client.size * 2) + client.size;
    client.y = spawn.y //(Math.random() * this.height - client.size * 2) + client.size;
    client.element = "basic";
    client.energy = 100;
    client.lastEnergy = 100;
    client.hp = 100;
    client.arenaId = this.id;
    client.xp = 0;
    client.bfric = 0.88;
    client.bxv = 0;
    client.byv = 0;

    client.spawnProt = 150;

    if (this.gamemode == "defense") {
      client.team = 5;
      client.x = this.width / 2;
      client.y = this.height / 2;
      client.spawnProt = 0;
    }


    const payLoad = {
      t: "npj", // new player joined
      i: client.getInitPack()
    }

    let initPacks = [];
    for (let i of Object.keys(this.players)) {
      const player = this.players[i];
      //send new client data to players
      player.ws.send(msgpack.encode(payLoad));
      //add player data to payLoad
      initPacks.push(player.getInitPack());
    }


    let self_data = JSON.parse(JSON.stringify(client));

    let whitelist = ["name", "x", "y", "gameId", "fov", "element", "size", "xp", "spawnProt", "team"];

    for (let p in Object.keys(self_data)) { // whitelist properties to send and remove unnecessary ones
      if (!whitelist.includes(p)) {
        delete self_data[p];
      }
    }

    // send data to new client
    const payLoad2 = {
      t: "jss", // join server successful
      pd: initPacks, // player data
      s: self_data, //Self
      aW: this.width,
      aH: this.height,
    };
    if (this.gamemode == "defense") {
      payLoad2.wv = this.wave;
      if (this.timer != Infinity) {
        payLoad2.tim = Math.round(this.timer * 100) / 100
      }
    }
		if(this.zone != -1){
			payLoad2.z = this.zone;
		}
    client.ws.send(msgpack.encode(payLoad2));

    //Add new player
    this.players[client.gameId] = client;
    if (this.gamemode == "team" || this.gamemode == "defense") {
      this.playerqt.push({
        x: client.x - client.size,
        y: client.y - client.size,
        width: client.size * 2,
        height: client.size * 2,
        gameId: client.gameId,
        team: client.team
      });
    } else {
      this.playerqt.push({
        x: client.x - client.size,
        y: client.y - client.size,
        width: client.size * 2,
        height: client.size * 2,
        gameId: client.gameId
      });
    }

    this.playerCount++;
  }
  static getAllSelectionData(arenas) {
    let data = [];
    for (let i of Object.keys(arenas)) {
      const arena = arenas[i];
      data.push(arena.getSelectionData());
    }
    return data;
  }
}

module.exports = { Client, Arena, Tower, Bullet, Enemy }