function createImage(svg) {
	let imageMade = new Image();
	imageMade.src = svg;
	return imageMade;
}

import { sendPacket } from "../socket.js";

export let packetSent = false;


const ConvertTowerToId = {
  "farm": 0,
  "basic": 1,
  "healer": 2
}

const ElementSprites = {
	basic: createImage("../../assets/elements/element_basic.svg"),
}

const TowerSprites = {
	farm: {
		yellow: createImage("../../assets/towers/tower_farm_yellow.svg"),
		red: createImage("../../assets/towers/tower_farm_red.svg")
	},
	basic: {
		yellow: createImage("../../assets/towers/tower_basic_yellow.svg"),
		red: createImage("../../assets/towers/tower_basic_red.svg")
	}
}
const IconSprites = {
	energy: createImage("../../assets/icons/logo_energy.svg"),
	health: createImage("../../assets/icons/logo_health.svg")
}





export function Render(gameData, ctx, canvas, held, mouse, toBePlaced, ws, sent) {
  packetSent = false;
	ctx.fillStyle = "rgb(180, 180, 180)"
	ctx.fillRect(0, 0, canvas.width, canvas.height);


  //Can you place the tower test
  let canPlace = true;


  //Save current state of canvas
	ctx.save();
  //Field of Vision scale
	ctx.scale(gameData.you.fov, gameData.you.fov);
  //Translate so it centers on you
	ctx.translate(-gameData.you.x + (canvas.width / 2) * 1 / gameData.you.fov, -gameData.you.y + (canvas.height / 2) * 1 / gameData.you.fov);
  //Get player data all in one object
	let players = JSON.parse(JSON.stringify(gameData.players));
	players[gameData.you.gameId] = JSON.parse(JSON.stringify(gameData.you));
  //Draw Arena Border
	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.fillRect(-10, -10, gameData.arenaWidth + 20, gameData.arenaHeight + 20);
  //Draw Arena
	ctx.fillStyle = "rgb(200, 200, 200)"
	ctx.fillRect(0, 0, gameData.arenaWidth, gameData.arenaHeight);

	// DRAW GRID
	let gridWidth = 500;
	ctx.strokeStyle = "rgb(180, 180, 180)"
	ctx.lineWidth = 5;
	for (let gridW = 1; gridW < gameData.arenaHeight / gridWidth; gridW++) {
		ctx.beginPath();
		ctx.moveTo(0, gridWidth * gridW);
		ctx.lineTo(gameData.arenaWidth, gridWidth * gridW);
		ctx.stroke();
	}
	for (let gridH = 1; gridH < gameData.arenaWidth / gridWidth; gridH++) {
		ctx.beginPath();
		ctx.moveTo(gridWidth * gridH, 0);
		ctx.lineTo(gridWidth * gridH, gameData.arenaHeight);
		ctx.stroke();
	}


  //Draw Player

	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.font = "20px Arial";
	for (let id of Object.keys(players)) {
		const player = players[id];
		if (player.x != null && player.y != null) {
      //Player
			ctx.drawImage(ElementSprites[player.element], player.x - player.size, player.y - player.size, player.size * 2, player.size * 2)
      //name
			ctx.fillText(player.name, player.x, player.y + player.size + 15);
		}
    //Cannot place check
    if (Math.sqrt(
      Math.pow(
        mouse.x - ((player.x-gameData.you.x)*gameData.you.fov + canvas.width/2), 2) + 
      Math.pow(
        mouse.y - ((player.y-gameData.you.y)*gameData.you.fov + canvas.height/2), 2) 
    ) < 40 + player.size){
      canPlace = false;
    }
	}

	//Draw Energy Bar
	ctx.restore();
	ctx.textAlign = "center"
	ctx.lineWidth = 25;
	ctx.lineCap = "round";
	ctx.beginPath()
	ctx.strokeStyle = "rgb(0, 0, 0)"
	ctx.moveTo(450, 780);
	ctx.lineTo(1600 - 400, 780);
	ctx.stroke();
	ctx.beginPath()
	ctx.lineWidth = 20;
	ctx.strokeStyle = "#e7cc47"
	ctx.moveTo(450, 780);
	ctx.lineTo(1600 - 400 - ((1 - (gameData.you.energy / gameData.you.maxEnergy)) * 750), 780);
	ctx.stroke();

	ctx.drawImage(IconSprites.energy, 360, 730, 95, 95);


	//Draw HP Bar
	ctx.textAlign = "center"
	ctx.lineWidth = 25;
	ctx.lineCap = "round";
	ctx.beginPath()
	ctx.strokeStyle = "rgb(0, 0, 0)"
	ctx.moveTo(450, 740);
	ctx.lineTo(800, 740);
	ctx.stroke();
	ctx.beginPath()
	ctx.lineWidth = 20;
	ctx.strokeStyle = "#ca3e2c"
	ctx.moveTo(450, 740);
	ctx.lineTo(800 - ((1 - (gameData.you.hp / gameData.you.maxHP)) * 350), 740);
	ctx.stroke();

	ctx.drawImage(IconSprites.health, 360, 690, 95, 95);

  //Draw slots on bottom

	ctx.lineCap = "butt";

	let towerSlots = gameData.you.slots;
	let towerSlotsAmount = towerSlots.length;
	let towerSlotsLength = towerSlots.length - 1;
	for (let i = 0; i < towerSlotsAmount; i++) {
		let slotX = 800 - (towerSlotsLength / 2) * 100 + i * 100;
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.fillRect(slotX - 40, 800, 80, 80)
		ctx.globalAlpha = 1;
		ctx.drawImage(TowerSprites[towerSlots[i]].yellow, slotX - 60, 780, 120, 120)
		ctx.font = "16px Arial";
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.fillText(i + 1, slotX - 31, 872)

	}

  if (mouse.x - ((0 - gameData.you.x)*gameData.you.fov + canvas.width/2) < 40){
    canPlace = false;
  }
  if (mouse.y - ((0 - gameData.you.y)*gameData.you.fov + canvas.height/2) < 40){
    canPlace = false;
  }
  if (mouse.x - ((gameData.arenaWidth - gameData.you.x)*gameData.you.fov + canvas.width/2) > -40){
    canPlace = false;
  }
  if (mouse.y - ((gameData.arenaHeight - gameData.you.y)*gameData.you.fov + canvas.height/2) > -40){
    canPlace = false;
  }


  //Draw thing that you are holding (when placing towers
  if (held != false){
    ctx.globalAlpha = 0.4;
    ctx.drawImage(TowerSprites[held].yellow, mouse.x-80, mouse.y-80, 160, 160);

    if (Math.sqrt(Math.pow(mouse.x-canvas.width/2, 2)+Math.pow(mouse.y-canvas.height/2, 2)) > 400){
      canPlace = false;
    }

    if (canPlace === false){
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.fillStyle = "rgb(255, 0, 0)"
      ctx.arc(mouse.x, mouse.y, 41, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.arc(800, 450, 400, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    if (toBePlaced && held != false && canPlace === true){
      const payLoad = {
        t: "pt",
        mx: mouse.x,
        my: mouse.y,
        tt: ConvertTowerToId[held]
      }
      sendPacket(ws, payLoad)
      held = false;
      packetSent = true;
    }

  }

}


