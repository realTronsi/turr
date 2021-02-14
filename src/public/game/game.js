import { Player } from "./player.js";
import { Tower } from "./tower.js";
import { Bullet } from "./bullet.js";
import { Render} from "./render.js";
import { Update } from "./update.js";
import { checkTowerPlace } from "./checkTowerPlace.js";
import { sendPacket } from "../socket.js";

const ConvertTowerToId = {
  "farm": 0,
  "basic": 1,
  "heal": 2
}







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
    towers: {},
		you: new Player(data.s) // yourself
	};
  let held = false;
  let mouseLock = false;
  let canPlace = true;
  let leaderboard = [];

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
    if (mouseLock === false){
      //Place Tower  
      if (held != false && canPlace == true){
        const payLoad = {
          t: "pt",
          mx: mouse.x,
          my: mouse.y,
          tt: ConvertTowerToId[held]
        }
        sendPacket(client.ws, payLoad)
        held = false;
      }
    }
    mouseLock = true;
  })
  canvas.addEventListener("mouseup", function (e) {
    mouseLock = false;
  })
  


	document.onkeydown = e => {
    if (!e.repeat){
    if (e.key === " "){
      //Place Tower
      if (held != false && canPlace == true){
        const payLoad = {
          t: "pt",
          mx: mouse.x,
          my: mouse.y,
          tt: ConvertTowerToId[held]
        }
        sendPacket(client.ws, payLoad)
        held = false;
      }
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
  //Send mousex and mousey as mx and my




	client.ws.onclose = () => {
		//Close Game
    alert("You've been disconnected from the server!")
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
          for(let towerData of data.tp) {
            if (towerData.pi != undefined){
              gameData.towers[towerData.id] = new Tower(towerData);
            }
            else{
              gameData.towers[towerData.id].updatePack(towerData);
            }
          }
          if (data.e != undefined){
            gameData.you.energy = data.e;
          }
          if (data.h != undefined){
            gameData.you.hp = data.h;
          }
          if (data.xp != undefined){
            gameData.you.xp = data.xp;
          }
          break;
				}
				case "pl": {
					//Player Left
					delete gameData.players[data.g];
          break;
				}
        case "ntp": {
          //New tower placed
          gameData.towers[data.d.id] = new Tower(data.d);
          break;
        }
        case "rt": {
          delete gameData.towers[data.id];
          break;
        }
        case "lb": {
          leaderboard = data.lb;
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
    if (held != false){
      canPlace = checkTowerPlace(gameData, mouse, held);
    }
		Render(gameData, ctx, canvas, held, mouse, canPlace, leaderboard);
    Update(gameData, delta)

		requestAnimationFrame(() => {
			mainLoop(gameData);
		});
	}
	requestAnimationFrame(() => { mainLoop(gameData) });
}