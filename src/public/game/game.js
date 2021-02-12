import { Player } from "./player.js";
import { Render } from "./render.js";
import { sendPacket } from "../socket.js"




export function initGame(data, client) {
	//Show Game Div
	const serverSelection = document.getElementById("server-selection")
	const gameDiv = document.getElementById("game");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");

	serverSelection.style.display = "none";
	gameDiv.style.display = "";

	//Define game data
	const gameData = {
		arenaWidth: data.aW,
		arenaHeight: data.aH,
		players: {},
		you: new Player(data.s) // yourself
	};

	//Create New Players from Data Sent
	for (let playerData of data.pd) {
		gameData.players[playerData.g] = new Player(playerData);
	}


	document.onkeydown = e => {
		if (!e.repeat) {
			sendPacket(client.ws, {
				t: "keyd", //keydown
				c: e.key
			});
		}
	}
	document.onkeyup = (e) => {
		sendPacket(client.ws, {
			t: "keyu", //keyup
			c: e.key
		});
	}



	client.ws.onclose = () => {
		//Close Game
    console.log("client ws is pooped")
	}
	client.ws.onmessage = msg => {
		// handle errors/success
		//try {
			let data = msgpack.decode(new Uint8Array(msg.data));
			switch (data.t) {
				case "npj": {
					//New Player Join
					gameData.players[data.i.g] = new Player(data.i)
          break;
				}
				case "u": {
					//Update
					for (let playerData of data.p) {
						if (gameData.players[playerData.g] != undefined) {
              //Update player that isn't you
							gameData.players[playerData.g].updatePack(playerData);
						} else if (gameData.you.gameId === playerData.g) {
              //Update player that is you
							gameData.you.updatePack(playerData)
						}
					}
          if (data.e != undefined){
            gameData.you.energy = data.e;
          }
          if (data.h != undefined){
            gameData.you.hp = data.h;
          }
          break;
				}
				case "pl": {
					//Player Left
					delete gameData.players[data.g];
          break;
				}
			}
		//} catch (err) { 
		//	alert(err);
		//}
	}

	function mainLoop(gameData) {
		//Update Game
		//try {
		Render(gameData, ctx, canvas);
		requestAnimationFrame(() => {
			mainLoop(gameData);
		});
		//} catch (err) {
		//	alert(err);
		//}
	}
	requestAnimationFrame(() => { mainLoop(gameData) });
}