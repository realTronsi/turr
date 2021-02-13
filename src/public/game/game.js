import { Player } from "./player.js";
import { Render, packetSent } from "./render.js";
import { Update } from "./update.js";
import { sendPacket } from "../socket.js";




export function initGame(data, client) {
	//Show Game Div
	const serverSelection = document.getElementById("server-selection")
	const gameDiv = document.getElementById("game");
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");
  let lastTime = window.performance.now();
  let mouse = {
    x: 0,
    y: 0
  };

	serverSelection.style.display = "none";
	gameDiv.style.display = "";

	//Define game data
	const gameData = {
		arenaWidth: data.aW,
		arenaHeight: data.aH,
		players: {},
		you: new Player(data.s) // yourself
	};
  let held = false;
  let toBePlaced = false;

	//Create New Players from Data Sent
	for (let playerData of data.pd) {
		gameData.players[playerData.g] = new Player(playerData);
	}


  canvas.addEventListener("mousemove", function (e) {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scale = window.innerWidth / canvas.width;
    if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
      scale = window.innerHeight / canvas.height;
    }
	  const rect = canvas.getBoundingClientRect();
	  mouse.x = Math.round((e.clientX - rect.left) / scale);
	  mouse.y = Math.round((e.clientY - rect.top) / scale);
  })
  canvas.addEventListener("mousedown", function (e) {
    toBePlaced = true;
  })
  canvas.addEventListener("mouseup", function (e) {
    toBePlaced = false;
  })
  


	document.onkeydown = e => {
    if (e.key === " "){
      toBePlaced = true;
    }
    for(let i = gameData.you.slots.length; i>0; i--){
      if (String(e.key) === String(i)){
        if (held == gameData.you.slots[Number(e.key)-1]){
          held = false;
        }
        else{
          held = gameData.you.slots[Number(e.key)-1];
        }
      }
    }
		if (!e.repeat) {
			sendPacket(client.ws, {
				t: "keyd", //keydown
				c: e.key
			});
		}
	}
	document.onkeyup = (e) => {
    if (e.key === " "){
      toBePlaced = false;
    }
		sendPacket(client.ws, {
			t: "keyu", //keyup
			c: e.key
		});
	}
  //Send mousex and mousey as mx and my




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
    let delta = window.performance.now() - lastTime;
    lastTime = window.performance.now();
		//Update Game
		//try {
		Render(gameData, ctx, canvas, held, mouse, toBePlaced, client.ws);
    Update(gameData, delta)
    if (packetSent){
      held = false;
    }
		requestAnimationFrame(() => {
			mainLoop(gameData);
		});
		//} catch (err) {
		//	alert(err);
		//}
	}
	requestAnimationFrame(() => { mainLoop(gameData) });
}