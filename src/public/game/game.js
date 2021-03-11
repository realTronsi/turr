import { Player } from "./player.js";
import { Tower } from "./tower.js";
import { Bullet } from "./bullet.js";
import { Render } from "./render.js";
import { Update } from "./update.js";
import { checkTowerPlace } from "./checkTowerPlace.js";
import { sendPacket } from "../socket.js";

import { ElementTiers, TierXP } from "./utils/tierList.js";
import { ConvertTowerToId } from "./utils/towerCast.js";

const chatHolder = document.getElementById("chatHolder");
const chatBox = document.getElementById("chatBox");

let chatOpened = false;

export function initGame(data, client) {
  document.getElementById("menu").style.display = "none";

  document.getElementById("turrad1").style.display = "none";
  document.getElementById("turrad2").style.display = "none";

  aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_1'); });
  aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_2'); });


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
  let interpTime = 500;

  window.onbeforeunload = (e) => {
    return "";
  }

  serverSelection.style.display = "none";
  gameDiv.style.display = "";

  //Define game data
  const gameData = {
    arenaWidth: data.aW,
    arenaHeight: data.aH,
    players: {},
    towers: {},
    bullets: {},
    teamMinimap: [],
    you: new Player(data.s) // yourself
  };
  let held = false;
  let mouseLock = false;
  let canPlace = true;
  let leaderboard = [];
  let gameMessages = [];
  let deathScreenOpacity = 0;
  let respawnTime = 0;

  //Create New Players from Data Sent
  for (let playerData of data.pd) {
    gameData.players[playerData.g] = new Player(playerData);
  }


  canvas.addEventListener("mousemove", function(e) {
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
  canvas.addEventListener("mousedown", function(e) {
    if (mouseLock === false) {
      if (gameData.you.dead == true){
        if (mouse.x > 690 && mouse.x < 690 + 220 && mouse.y > 695 && mouse.y < 695 + 60 && respawnTime >= 5) {
          //Respawn
          sendPacket(client.ws, {
            t: "res"
          })
        }
        if (mouse.x > 690 && mouse.y > 765 && mouse.x < 690 + 220 && mouse.y < 765 + 40){
          //Reward Ad
					//show_reward_ad();
        }
      }
      //Place Tower  
      if (held != false && canPlace == true && !chatOpened) {
        const payLoad = {
          t: "pt",
          mx: mouse.x,
          my: mouse.y,
          tt: ConvertTowerToId[held]
        }
        sendPacket(client.ws, payLoad)
        held = false;
      }
      let xpTier = 0;
      while (true) {
        if (xpTier >= TierXP.length) {
          break;
        }
        if (gameData.you.xp < TierXP[xpTier + 1]) {
          break;
        }
        xpTier++;
      }
      if (xpTier >= ElementTiers[gameData.you.element].tier) {
        let upgrades = ElementTiers[gameData.you.element].upgrades;
        let upgradesAmount = upgrades.length;
        let upgradesLength = upgrades.length - 1;
        for (let i = 0; i < upgradesAmount; i++) {
          let slotX = 800 - (upgradesLength / 2) * 120 + i * 120;
          if (mouse.x > slotX - 50 && mouse.x < slotX + 50 && mouse.y > 100 && mouse.y < 200) {
            const payLoad = {
              t: "upg",
              c: i
            }
            sendPacket(client.ws, payLoad)
          }
        }
      }
    }
    mouseLock = true;
  })
  canvas.addEventListener("mouseup", function(e) {
    mouseLock = false;
  })



  document.onkeydown = e => {
    if (!e.repeat) {
      if (gameData.you.dead != true) {
        if (e.key === " " && !chatOpened) {
          //Place Tower
          if (held != false && canPlace == true) {
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
        for (let i = gameData.you.slots.length; i > 0; i--) {
          if (String(e.key) === String(i) && !chatOpened) {
            if (held == gameData.you.slots[Number(e.key) - 1]) {
              held = false;
            }
            else {
              held = gameData.you.slots[Number(e.key) - 1];
            }
          }
        }

        if (e.key === "Enter") {
          if (chatOpened === false) {
            chatHolder.style.display = "block";
            chatBox.focus();
            chatOpened = true;
          }
          else {
            chatHolder.style.display = "none";
            chatBox.blur();
            if (/^\s*$/.test(chatBox.value)) {
              chatBox.value = "";
            }
            else {
              const payLoad = {
                t: "ch",
                m: chatBox.value
              }
              sendPacket(client.ws, payLoad)
              chatBox.value = "";
            }
            chatOpened = false;
          }
        }
      }


      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(e.key) && gameData.you.dead != true && !chatOpened) {
        sendPacket(client.ws, {
          t: "kd", //keydown
          c: e.key
        });
      }
    }
  }
  document.onkeyup = (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(e.key) && gameData.you.dead != true) {
      sendPacket(client.ws, {
        t: "ku", //keyup
        c: e.key
      });
    }
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
      case "res": {
        document.getElementById("turrad3").style.display = "none";
        document.getElementById("turrad4").style.display = "none";
        
        aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_3'); });
        aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_4'); });

        gameData.you.dead = false;
        gameData.you.xp = data.s;
        gameData.you.element = "basic";
        deathScreenOpacity = 0;
        respawnTime = 0;
        gameData.you.fov = 1;
        gameData.you.toFov = 1;
        gameData.you.hp = 100;
        gameData.you.maxHP = 100;
        gameData.you.maxEnergy = 100;
        gameData.you.energy = 100;
        gameData.you.slots = ElementTiers["basic"].towers;

        for (let i of Object.keys(gameData.players)) {
          const player = gameData.players[i];
          player.x = Infinity;
          player.y = Infinity;
          player.serverX = Infinity;
          player.serverY = Infinity;
          player.middleX = Infinity;
          player.middleY = Infinity;
        }

        break;
      }
      case "u": {
        //get bytelength = console.log(msg.data.byteLength)

        //Update
        interpTime = 1000 / 20;
        for (let playerData of data.p) {
          if (gameData.players[playerData.g] != undefined) {
            //Update player that isn't you
            gameData.players[playerData.g].updatePack(playerData);
          } else if (gameData.you.gameId === playerData.g) {
            //Update player that is you
            gameData.you.updatePack(playerData)
          }
        }
        for (let towerData of data.tp) {
          if (towerData.pi != undefined) {
            gameData.towers[towerData.id] = new Tower(towerData);
          }
          else {
            gameData.towers[towerData.id].updatePack(towerData);
          }
        }
        for (let bulletData of data.bp) {
          if (bulletData.i != undefined) {
            if (bulletData.pi != undefined) {
              gameData.bullets[bulletData.i] = new Bullet(bulletData)
            }
            else if (bulletData.rem != 1) {
              gameData.bullets[bulletData.i].updatePack(bulletData);
            }
            else {
              delete gameData.bullets[bulletData.i]
            }
          }
        }
        if (data.e != undefined) {
          gameData.you.svrenergy = data.e;
        }
        if (data.h != undefined) {
          gameData.you.svrhp = data.h;
        }
        if (data.xp != undefined) {
          gameData.you.xp = data.xp;
        }
        break;
      }
      case "pl": {
        //Player Left
        delete gameData.players[data.g];
        break;
      }
      case "mm": {
				let minimap = [];
				for(let p = 0; p < data.d.length; p+=2){
					if(p != data.s * 2){
						minimap.push({
							x: data.d[p],
							y: data.d[p + 1]
						});
					}
				}
        gameData.teamMinimap = minimap;
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
      case "rb": {
        gameData.bullets[data.i].die = true;
        gameData.bullets[data.i].dx = gameData.bullets[data.i].serverX - gameData.bullets[data.i].lastX;
        gameData.bullets[data.i].dy = gameData.bullets[data.i].serverY - gameData.bullets[data.i].lastY;
        gameData.bullets[data.i].serverX = data.x;
        gameData.bullets[data.i].serverY = data.y;

        break;
      }
      case "yd": {
        //You noob imagine dying
        document.getElementById("turrad3").style.display = "block";
        document.getElementById("turrad4").style.display = "block";
        
        aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_3'); });
        aiptag.cmd.display.push(function() { aipDisplayTag.display('turr-io_160x600_4'); });
        gameData.you.dead = true;
        gameData.you.killer = data.n;
        gameData.you.finalScore = data.s;
        held = false;
        deathScreenOpacity = 0;
        respawnTime = 0;
        chatHolder.style.display = "none";
        chatBox.blur();
        chatBox.value = "";
        chatOpened = false;
        break;
      }
      case "pd": {
        delete gameData.players[data.i];

        break;
      }
      case "ykp": {
        //You, a pro, killed a noob
        //n: name

        gameMessages.push({ 
          value: "You killed " + data.n,
          timer: 4
        })

        break;
      }
      case "lb": {
        leaderboard = data.lb;

        break;
      }
      case "dch": {
        if (gameData.players[data.i] != undefined) {
          gameData.players[data.i].chatDeletion = true;
        }
        if (data.i === gameData.you.id) {
          gameData.you.chatDeletion = true;
        }

        break;
      }
      case "ch": {
        if (gameData.players[data.i] != undefined) {
          gameData.players[data.i].chatMessage = data.m;
          gameData.players[data.i].chatOpacity = 1;
          gameData.players[data.i].chatDeletion = false;
        }
        if (data.i === gameData.you.id) {
          gameData.you.chatMessage = data.m;
          gameData.you.chatOpacity = 1;
          gameData.you.chatDeletion = false;
        }

        break;
      }
      case "chf": {
        gameMessages.push({
          value: "You are chatting too fast!",
          timer: 4
        })
        break;
      }

    }
    //} catch (err) { 
    //	alert(err);
    //}
  }

  function mainLoop(gameData) {
    //ok stuff
    let delta = window.performance.now() - lastTime;
    lastTime = window.performance.now();
    //Update Game
    if (held != false) {
      canPlace = checkTowerPlace(gameData, mouse, held);
    }
    gameMessages = gameMessages.filter((e) => e.timer > 0);
    for (let i of gameMessages) {
      i.timer -= delta / 1000;
    }
    gameData.you.fov += (gameData.you.toFov - gameData.you.fov) / 20;
    if (gameData.you.dead == true) {
      deathScreenOpacity += (0.5 - deathScreenOpacity) / 20;
      respawnTime += delta/1000;
    }
    interpTime -= delta;

    Render(gameData, ctx, canvas, held, mouse, canPlace, leaderboard, gameMessages, deathScreenOpacity, respawnTime);
    Update(gameData, delta, gameMessages, interpTime)
    requestAnimationFrame(() => {
      mainLoop(gameData);
    });
  }
  requestAnimationFrame(() => { mainLoop(gameData) });
}