const express = require('express');
const WebSocket = require('ws');
const msgpack = require("msgpack-lite");
const path = require("path");
const uuid = require("uuid");
const app = express();
const wss = new WebSocket.Server({ noServer: true });
const server = app.listen(3000);
/*
npm install svg-url-loader --save-dev
*/



//Setting Up Server
app.use(express.static("dist"));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});

server.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, socket => {
		wss.emit('connection', socket, request);
	});
});

//Constants Defining
const arenas = {};
const clients = {};
const { Client, Arena } = require("./objects");
const { update } = require("./update");
const { whiteSpace } = require("./utils/whiteSpace");

(() => {
  let arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "No", 40, 40, 5);
  arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "1v1 Room", 1500, 1500, 2);
	arenaId = uuid.v4();
	arenas[arenaId] = new Arena(arenaId, "Torture", 500, 500, 12);
	for (let arenaCreateVariable = 4; arenaCreateVariable > 0; arenaCreateVariable--) {
		let arenaId = uuid.v4();
		arenas[arenaId] = new Arena(arenaId, "Arena " + arenaCreateVariable, 3000, 3000, 15);
	}
})();




wss.on('connection', ws => {
	ws.binaryType = "arraybuffer"; // for msgpack
	const clientId = uuid.v4();
	const client = new Client(ws, clientId);
	clients[clientId] = client;

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
                client.anem = client.name.slice(0, 16);
                if (!/\S/.test(client.name)){
                  client.name = "Player";
                }
								// successful join
								arena.addPlayer(client);
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
				case "keyd": {
					//key down
					client.keys[data.c] = true;
					break;
				}
				case "keyu": {
					//key up
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
    let affectedArena;
    let deletedClient;
    for(let i of Object.keys(arenas)){
      const arena = arenas[i];
      for(let i of Object.keys(arena.players)){
        const player = arena.players[i];
        if (player.id === clientId){
          deletedClient = player;
          affectedArena = arena;
          break;
        }
      }
    }
    if (affectedArena != undefined && deletedClient != undefined){
    delete affectedArena.players[deletedClient.id];
    affectedArena.playerCount --;
    for(let i of Object.keys(affectedArena.players)){
      const player = affectedArena.players[i];
      const payLoad = {
        t: "pl",
        g: deletedClient.gameId
      }
      player.ws.send(msgpack.encode(payLoad))
    }
    }
		delete clients[clientId];
	});

});


//Update Game
setInterval(() => { update(arenas) }, 1000 / 30)