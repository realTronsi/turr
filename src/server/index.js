const express = require('express');
const WebSocket = require('ws');
const msgpack = require("msgpack-lite");
const path = require("path");
const uuid = require("uuid");
//const rateLimit = require("ws-rate-limit")(50, '2s')
const app = express();

/*
major bugs
client crashes when 20 bots, also weird issue where packets arent updating when 20 bots so ur energy bar isn't growing and everything is like delayed but ur movement is fine so its super weird 

EDIT I THINK ITS MAXPAYLOAD IM TURNING OFF MAXPAYLOAD FOR THE NOT SHOWING ENERGY BAR AND STUFF

ALso sometimes first bullet of plasma tower is hidden underneath

also bug where u can still select tower while typing in chat, so like try typing 3 in chat or smth (causes a bunch of accidentally placements)

these all need to be fixed immediately :P

if theres lag spike client interpolation goes absolutely nuts and u start jittering if packets are slightly delayed

try to make interpolation so its like diep where after a while it stops or smth, try going on diep and go to team and in the middle oft he map and when you lag try seeing how you move. iirc it just stops intepo if it doesn't get packets from server for long enough 

also we need to rework respawn screen so it fades in and pppl can't immediately respawn

on a side note, we should ad the ads on respawn screen now, and add a message to say "please consider disabling your ad blocker to support turr" if adblocker is on

also we need to call the ad refresh button on menus, so if someone goes tutorial screen or goes server selection ads should refresh
*/
/*
did u fix we need fix
*/

/* FOR TURR.IO

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

const server = app.listen(3000);

let lastTime = Date.now();

/*
npm install svg-url-loader --save-dev
*/

//Setting Up Server
app.use(express.static("dist"));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.get('/robots.txt', function (req, res) {
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
	arenas[arenaId] = new Arena(arenaId, "1v1 Sandbox", 1500, 1500, 2, "sandbox");
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "1v1 Room 2", 1500, 1500, 2, "normal");
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "1v1 Room 1", 1500, 1500, 2, "normal");
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "Sandbox 1", 4000, 4000, 20, "sandbox");
	for (let arenaCreateVariable = 2; arenaCreateVariable > 0; arenaCreateVariable--) {
		let arenaId = uuid.v4();
		arenas[arenaId] = new Arena(arenaId, "Arena " + arenaCreateVariable, 4000, 4000, 20, "normal");
	}
})();



wss.on('connection', (ws, req) => {
	ws.binaryType = "arraybuffer"; // for msgpack

	if(req.headers.origin != "https://turrio.realtronsi.repl.co" && req.headers.origin != "https://4adfe54e-0dc8-4394-90b7-5a8558b05f14.id.repl.co"){
		// send CORS error message
		ws.close();
	}


	//rateLimit(ws);

	const clientId = uuid.v4();
	const client = new Client(ws, clientId);
	clients[clientId] = client;
	let clientArena;
	
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

					let towerName = ttToStr[data.tt];

					if (!ElementStats[client.element].towers.includes(towerName)) break;

					let towerX = client.x + ((data.mx - 800) * 1 / client.fov); // tower coords (calculated based off of data)
					let towerY = client.y + ((data.my - 450) * 1 / client.fov);

					let buffer = 2; // buffer for collisions

					let towerSize = TowerStats[towerName].size;

					if (dist(client.x, client.y, towerX, towerY) > 400) { // check if over range
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
					clientArena.towerqt.push({
						x: towerX - towerSize,
						y: towerY - towerSize,
						width: towerSize * 2,
						height: towerSize * 2,
						id: towerid,
						parentId: client.gameId
					});

					client.spawnProt = 0; // disable spawnProt
					client.changed["spawnProt"] = true;
					break;
				}
				case "upg": {
					// upgrade element
					if (client.tier == 1 && client.xp < 3000) break;
					if (client.tier == 2 && client.xp < 15000) break;
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
					client.changed["x"] = true;
					client.changed["y"] = true;
					client.inFov = [];
					client.keys = [];
					client.element = "basic";
					client.changed["element"] = true;

					arenas[client.arenaId].playerqt.push({
						x: client.x - client.size,
						y: client.y - client.size,
						width: client.size * 2,
						height: client.size * 2,
						gameId: client.gameId
					});

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
  
  ws.on('limited', msg => {
    console.log("Person spammed too many messages to server.");
  });

	ws.on('close', () => {
		if (client.arenaId !== undefined) {
			let affectedArena = arenas[client.arenaId];
			let deletedClient = arenas[client.arenaId].players[client.gameId];
			if (affectedArena != undefined && deletedClient != undefined) {
				delete affectedArena.players[client.gameId];

				//Delete player in Quadtree
				let deleteQtPlayer = affectedArena.playerqt.find(function(element) {
					return element.gameId === deletedClient.gameId
				})
				if (deleteQtPlayer.length > 0) {
					affectedArena.playerqt.remove(deleteQtPlayer[0]);
				}
				affectedArena.playerCount = Object.keys(affectedArena.players).length;



				for (let i of Object.keys(affectedArena.players)) {
					const player = affectedArena.players[i];
					const payLoad = {
						t: "pl",
						g: deletedClient.gameId
					}
					player.ws.send(msgpack.encode(payLoad))
				}
			}
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