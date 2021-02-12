function createImage(svg){
  let imageMade = new Image();
  imageMade.src = svg;
  return imageMade;
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
  energy: createImage("../../assets/icons/logo_energy.svg")
}




export function Render(gameData, ctx, canvas){
	ctx.fillStyle = "rgb(180, 180, 180)"
	ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  

  ctx.save();
  ctx.scale(gameData.you.fov, gameData.you.fov);
  ctx.translate(-gameData.you.x+(canvas.width/2)*1/gameData.you.fov, -gameData.you.y+(canvas.height/2)*1/gameData.you.fov);

  let players = JSON.parse(JSON.stringify(gameData.players));
  players[gameData.you.gameId] = JSON.parse(JSON.stringify(gameData.you));

  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.fillRect(-10, -10, gameData.arenaWidth+20, gameData.arenaHeight+20);
  ctx.fillStyle = "rgb(200, 200, 200)"
  ctx.fillRect(0, 0, gameData.arenaWidth, gameData.arenaHeight);
	
	// DRAW GRID
  let gridWidth = 500;
  ctx.strokeStyle = "rgb(180, 180, 180)"
  ctx.lineWidth = 5;
  for(let gridW = 1; gridW < gameData.arenaHeight / gridWidth; gridW++){
    ctx.beginPath();
    ctx.moveTo(0, gridWidth * gridW);
    ctx.lineTo(gameData.arenaWidth, gridWidth * gridW);
    ctx.stroke();
  }
  for(let gridH = 1; gridH < gameData.arenaWidth / gridWidth; gridH++){
    ctx.beginPath();
    ctx.moveTo(gridWidth * gridH, 0);
    ctx.lineTo(gridWidth * gridH, gameData.arenaHeight);
    ctx.stroke();
  }
  


  
  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.font = "20px Arial";
  for(let id of Object.keys(players)){
    const player = players[id];
	  ctx.drawImage(ElementSprites[player.element], player.x-player.size, player.y-player.size, player.size*2, player.size*2)
    ctx.fillText(player.name, player.x, player.y+player.size+15);
    

  }

  //Draw Energy Bar
  ctx.restore();
  ctx.textAlign = "center"
  ctx.lineWidth = 25;
  ctx.lineCap = "round";
  ctx.beginPath()
  ctx.strokeStyle = "rgb(0, 0, 0)"
  ctx.moveTo(450, 780);
  ctx.lineTo(1600-400, 780);
  ctx.stroke();
  ctx.beginPath()
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#e7cc47"
  ctx.moveTo(450, 780);
  ctx.lineTo(1600-400 - ((1-(gameData.you.energy/gameData.you.maxEnergy))*750), 780);
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
  ctx.lineTo(800 - ((1-(gameData.you.hp/gameData.you.maxHP))*350), 740);
  ctx.stroke();

  

  ctx.lineCap = "butt";

  let towerSlots = gameData.you.slots;
  let towerSlotsAmount = towerSlots.length;
  let towerSlotsLength = towerSlots.length - 1;
  for(let i = 0; i<towerSlotsAmount; i++){
    let slotX = 800 - (towerSlotsLength/2)*100 + i * 100;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(slotX-40, 800, 80, 80)
    ctx.globalAlpha = 1;
    ctx.drawImage(TowerSprites[towerSlots[i]].yellow, slotX-63, 778, 120, 120)
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText(i+1, slotX-31, 872)
    
  }

}
