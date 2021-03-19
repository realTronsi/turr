const express = require('express');
const WebSocket = require('ws');
const msgpack = require("msgpack-lite");
const path = require("path");
const uuid = require("uuid");
const rateLimit = require("ws-rate-limit")("1s", 60)
const app = express();


//do not edit this or comment out until we move the removing client script into .die()

/* 
future security patches: limit incoming packet sizes

also fix bullet where we're calling arena.towers[collider.id] tons of times instead of assigning it into a variable and same for bullet
*/

/* FOR TURR.IO Remember to rename client app.js and append version number to enforce cache clearing such as app?v1.js

dont forget to update tutorial svg path + favicon + js

also remember to renable cors prevention

const fs = require('fs');
const https = require('https')
const httpsOptions = {
    cert: fs.readFileSync(path.resolve(__dirname, "../../ssl/turr.cert")),
    ca: fs.readFileSync(path.resolve(__dirname, "../../ssl/turr.ca-bundle")),
    key: fs.readFileSync(path.resolve(__dirname, "../../ssl/turr.key"))
}

const httpsServer = https.createServer(httpsOptions, app)

const WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({
    server: httpsServer
  });

app.use(express.static("src/dist"));

httpsServer.listen(443, "0.0.0.0")

*/
const wss = new WebSocket.Server({
	noServer: true
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT);

let lastTime = Date.now();

/*
npm install svg-url-loader --save-dev
*/

//Setting Up Server
app.use(express.static("dist"));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.get('/robots.txt', function(req, res) {
	res.type('text/plain');
	res.send("User-agent: *\nAllow: /");
});

app.get('*', (req, res) => {
	res.redirect("/");
});

server.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, socket => {
		wss.emit('connection', socket, request);
	});
});

//Constants Defining
const arenas = {};
const clients = {};
const { Client, Arena, Tower } = require("./objects");
const { update, sendToPlayers, updateLeaderboard, updateArenaLeaderboard } = require("./update");
const { dist } = require("./utils/dist");
const { ttToStr, strToTt } = require("./utils/ttcast");
const { reduce_num } = require("./utils/numred");
const { whiteSpace } = require("./utils/whiteSpace");
const { spawnPoint } = require("./utils/spawn");

const blacklist = ["nigger", "nigga", "ass", "dick", "vagina", "vulva", "penis", "asshole", "fuck", "shit", "cock", "testicle", "orgasm", "porn", "jerkoff", "masturbat", "fap", "oral sex", "anal", "anus", "nudes", "rape", "hentai", "loli", "hymen", "cum", "semen", "clitoris", "fag", "ching chong", "milf", "slut", "whore", "thot", "threesome", "bitch", "cunt", "clit", "raper", "motherfucker", "dipshit", "dumbfuck", "dumbass", "fucker", "prositute", "faggot"]

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function filterMsg(msg) {
	//msg.replace(whiteSpace, "")
	//for (let c of blacklist) {
	//  msg = replaceAll(msg, c, "****");
	//}
	return msg;
}


const { TowerStats, ElementStats } = require("./stats");

(() => {
	let arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "Sandbox", 2500, 2500, 15, "sandbox");
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "Two Teams", 4000, 4000, 15, "team_2");
  arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "Defense", 7000, 7000, 20, "defense");
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "FFA Normal", 4000, 4000, 20, "normal");

})();



wss.on('connection', (ws, req) => {
	ws.binaryType = "arraybuffer"; // for msgpack

	//console.log(req.headers.origin);

	if (req.headers.origin != "https://turrio.realtronsi.repl.co" && req.headers.origin != "https://4adfe54e-0dc8-4394-90b7-5a8558b05f14.id.repl.co" && req.headers.origin != "https://turr.io") {
    // send CORS error message
		ws.close(1003);
	}


	rateLimit(ws);

	const clientId = uuid.v4();
	const client = new Client(ws, clientId);
	clients[clientId] = client;
	let clientArena;

	ws.on('limited', msg => {
		ws.close(1008);
	});

	ws.on('message', msg => {
		try {
			let data = msgpack.decode(new Uint8Array(msg));
			switch (data.t) {
				case "ss": { // server selection
					ws.send(msgpack.encode({
						t: "ssr",
						d: Arena.getAllSelectionData(arenas)
					}))
					break;
				}
				case "js": { // join server
					if (client.state == "menu") {
						// eligble to join server
						client.state = "joiningServer";
						if (arenas[data.id] !== undefined) {
							// make sure server exists
							const arena = arenas[data.id];
							if (arena.playerCount >= arena.maxPlayers) {
								// full
								client.state = "menu";
								const payLoad = {
									t: "jsf", // join server fail
									m: "sf" // server full
								}
								ws.send(msgpack.encode(payLoad));
								break;
							} else {
								client.name = data.n;
								client.name = client.name.replace(whiteSpace, "")
								client.name = client.name.slice(0, 16);
								if (!/\S/.test(client.name)) {
									client.name = "Player";
								}
								// successful join
								arena.joinQueue.push(client);
								clientArena = arena;
								break;
							}
						} else {
							// no server
							client.state = "menu"
							const payLoad = {
								t: "jsf", // join server fail
								m: "ns" // no server
							}
							ws.send(msgpack.encode(payLoad));
							break;
						}
					}
					break;
				}
				case "pt": { // place tower

					// Convert .tt to string
					if (client.state != "game") break;
					if (client.canPlaceLast == false) break;

					let towerName = ttToStr[data.tt];

					if (!ElementStats[client.element].towers.includes(towerName)) break;

					let towerX = client.x + ((data.mx - 800) * 1 / client.fov); // tower coords (calculated based off of data)
					let towerY = client.y + ((data.my - 450) * 1 / client.fov);

					let buffer = 2; // buffer for collisions

					let towerSize = TowerStats[towerName].size;

					if (dist(client.x, client.y, towerX, towerY) > 400) { // check if over range
						break;
					}

					if(clientArena.zone != -1 && dist(clientArena.width / 2, clientArena.height / 2, towerX, towerY) > clientArena.zone){
						break;
					}

					if (towerX + buffer < towerSize || towerX - buffer > clientArena.width + towerSize || towerY + buffer < towerSize || towerY - buffer > clientArena.height + towerSize) { // check if out of bounds
						break;
					}
					let colliding = clientArena.towerqt.colliding({
						x: towerX - towerSize,
						y: towerY - towerSize,
						width: towerSize * 2,
						height: towerSize * 2
					}, function(element1, element2) {
						return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
					});
					if (colliding.length > 0) {
						// if colliding with another tower
						break;
					}

					colliding = clientArena.playerqt.colliding({
						x: towerX - towerSize,
						y: towerY - towerSize,
						width: towerSize * 2,
						height: towerSize * 2
					}, function(element1, element2) {
						return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
					});
					if (colliding.length > 0) {
						// if colliding with another client
						break;
					}

          colliding = clientArena.enemyqt.colliding({
						x: towerX - towerSize,
						y: towerY - towerSize,
						width: towerSize * 2,
						height: towerSize * 2
					}, function(element1, element2) {
						return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
					});
					if (colliding.length > 0) {
						// if colliding with an enemy
						break;
					}

          
					const energyNeeded = TowerStats[towerName].energy;
					if (client.energy < energyNeeded) {
						//Not enough energy
						break;
					} else {
						client.energy -= energyNeeded;
					}

					const towerid = clientArena.createTowerId();

					let tower = new Tower(towerid, client, towerX, towerY, towerName);

					clientArena.towers[towerid] = tower;

					// when pushing to quadtree, x and y represents top left corner so we must subtract the radius, keep this in mind for collision algorithms where we have to add back the radius
					if (client.team != undefined) {
						clientArena.towerqt.push({
							x: towerX - towerSize,
							y: towerY - towerSize,
							width: towerSize * 2,
							height: towerSize * 2,
							id: towerid,
							parentId: client.gameId,
							team: client.team
						});
					} else {
						clientArena.towerqt.push({
							x: towerX - towerSize,
							y: towerY - towerSize,
							width: towerSize * 2,
							height: towerSize * 2,
							id: towerid,
							parentId: client.gameId
						});
					}

					client.spawnProt = 0; // disable spawnProt
					client.changed["spawnProt"] = true;
					break;
				}
				case "upg": {
					// upgrade element
					if (client.tier == 1 && client.xp < 1000) break;
					if (client.tier == 2 && client.xp < 3000) break;
					if (ElementStats[client.element].upgrades == undefined) break;

					if (ElementStats[client.element].upgrades[data.c] != undefined) {
						// upgrade exists
						let element = ElementStats[client.element].upgrades[data.c];
						client.element = element;
						client.tier++;
						client.changed["element"] = true;
						client.stats = ElementStats[element];
						client.fov = client.stats.fov;
					}


					break;
				}
				case "res": {
					if (client.state != "dead") break;
					client.state = "game";
					client.killedBy = {
						id: undefined
					}
					let spawn = spawnPoint(arenas[client.arenaId]);
					client.x = spawn.x;
					client.y = spawn.y;

          if (arenas[client.arenaId].gamemode == "defense"){
            client.x = arenas[client.arenaId].width/2;
            client.y = arenas[client.arenaId].height/2;
          }

					client.xv = 0;
					client.yv = 0;
					client.bxv = 0;
					client.byv = 0;
					client.changed["x"] = true;
					client.changed["y"] = true;
					client.inFov = [];
					client.keys = [];
					client.element = "basic";
					client.changed["element"] = true;

					if (arenas[client.arenaId].gamemode == "team" || arenas[client.arenaId].gamemode == "defense") {
						arenas[client.arenaId].playerqt.push({
							x: client.x - client.size,
							y: client.y - client.size,
							width: client.size * 2,
							height: client.size * 2,
							gameId: client.gameId,
							team: client.team
						});
					} else {
						arenas[client.arenaId].playerqt.push({
							x: client.x - client.size,
							y: client.y - client.size,
							width: client.size * 2,
							height: client.size * 2,
							gameId: client.gameId
						});
					}

					client.spawnProt = 150;


					const payLoad = {
						t: "npj",
						i: client.getInitPack()
					}

					for (let i of Object.keys(arenas[client.arenaId].players)) {
						const player = arenas[client.arenaId].players[i];
						if (player.id != client.id) {
							player.ws.send(msgpack.encode(payLoad));
						}
					}

					const payLoad2 = {
						t: "res",
						s: Math.round(client.xp)
					}
					client.ws.send(msgpack.encode(payLoad2))

					break;
				}
				case "ch": {
					// chat
					if (client.chatTimer > 4) {
						ws.send(msgpack.encode({
							t: "chf"
						}));
						break;
					}
					data.m = data.m.slice(0, 36);
					//data.m = filterMsg(data.m);
					if (data.m.length > 0) {
						client.chatMessage = data.m;
						client.chatTimer = 5;
						const payLoad = {
							t: "ch",
							i: client.gameId,
							m: data.m
						}
						for (let p of Object.keys(clientArena.players)) {
							clientArena.players[p].ws.send(msgpack.encode(payLoad));
						}
					}

				}
				case "kd": {
					//key down
					if (client.state == "dead") break;
					client.keys[data.c] = true;
					break;
				}
				case "ku": {
					//key up
					if (client.state == "dead") break;
					client.keys[data.c] = false;
					break;
				}
				default: break;
			}
		}
		catch (err) {
			console.log(err);
		}
	});

	ws.on('close', () => {
		if (clientArena != undefined) {
			clientArena.closequeue.push(client);
		}
		delete clients[clientId];
	});

});


//Update Game
setInterval(() => {
	let delta = Date.now() - lastTime;
	lastTime = Date.now();
	//Check if delta is greater than the amount for 30 fps
	while (delta > 39) {
		update(arenas, 39)
		delta -= 39;
	}
	//Update the rest of the delta
	update(arenas, delta)
	sendToPlayers(arenas, delta);
}, 1000 / 30)
//Update Leaderboard
setInterval(() => {
	updateLeaderboard(arenas);
}, 1000 / 1)
//send minimap in team modes
setInterval(() => {
	for(let a of Object.keys(arenas)){
		const arena = arenas[a];
		if (arena.gamemode == "team"){
			for(let team of arena.teams){
				let data = [];
				for(let p in team){
					if(team[p].state != "dead"){
						data.push(Math.round(team[p].x));
						data.push(Math.round(team[p].y));
					}
				}
				for(let p in team){
					const payLoad = {
						t: "mm", //mini map
						d: data,
						s: p // self
					}
					team[p].ws.send(msgpack.encode(payLoad));
				}
			}
    }
    if (arena.gamemode == "defense"){
      let data = [];
      for(let p of Object.keys(arena.players)){
        const player = arena.players[p];
        if (player.state != "dead"){
				  data.push(Math.round(player.x));
				  data.push(Math.round(player.y));
        }
      }
			let edata = [];
			for(let e of Object.keys(arena.enemies)){
        const enemy = arena.enemies[e];
				edata.push(Math.round(enemy.x));
				edata.push(Math.round(enemy.y));
      }
      for(let p of Object.keys(arena.players)){
        const player = arena.players[p];
				let index = 0;
				for(let i = 0; i < data.length; i+=2){
					if(data[i] == Math.round(player.x)){
						if(data[i + 1] == Math.round(player.y)){
							index = i;
							break;
						}
					}
				}
        const payLoad = {
          t: "mm",
          d: data,
					e: edata,
          s: index
        }
        player.ws.send(msgpack.encode(payLoad));
      }
      
    }
	}
}, 1000 / 0.5)