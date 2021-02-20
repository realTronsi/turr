function createImage(svg) {
  let imageMade = new Image();
  imageMade.src = svg;
  return imageMade;
}

import { sendPacket } from "../socket.js";
import { reduce_num } from "./utils/numred.js";
import { wrapText } from "./utils/utils.js";
import { TowerStats } from "./utils/energyStats.js";
import { ElementTiers, TierXP } from "./utils/tierList.js";
import { roundRect } from "./utils/roundRect.js";

const TowerDescriptions = {
  farm: `Slowly gives XP`,
  basic: `Shoots at things`,
  heal: `Heals in a radius`,
  bomb: `Shoots bombs at things`,
  propel: `Propels you upon contact`,
  streamer: `Rapidly shoots water`,
  drown: `Slows down others`,
  splinter: `Shoots seeds which bloom`,
  observatory: `Gives you more vision`
}

const ElementSprites = {
  basic: createImage("../../assets/elements/element_basic.svg"),
  fire: createImage("../../assets/elements/element_fire.svg"),
  water: createImage("../../assets/elements/element_water.svg"),
  earth: createImage("../../assets/elements/element_earth.svg"),
  magma: createImage("../../assets/elements/element_magma.svg"),
}

function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const BulletSprites = {
  basic: {
    yellow: createImage("../../assets/bullets/basic_yellow.svg"),
    red: createImage("../../assets/bullets/basic_red.svg")
  },
  bomb: {
    yellow: createImage("../../assets/bullets/basic_yellow.svg"),
    red: createImage("../../assets/bullets/basic_red.svg")
  },
  water: {
    yellow: createImage("../../assets/bullets/water_blue.svg"),
    red: createImage("../../assets/bullets/basic_red.svg")
  },
  splinter: {
    yellow: createImage("../../assets/bullets/splinter_green.svg"),
    red: createImage("../../assets/bullets/basic_red.svg")
  }
}
const TowerSprites = {
  farm: {
    yellow: createImage("../../assets/towers/tower_farm_yellow.svg"),
    red: createImage("../../assets/towers/tower_farm_red.svg")
  },
  basic: {
    yellow: createImage("../../assets/towers/tower_basic_yellow.svg"),
    red: createImage("../../assets/towers/tower_basic_red.svg")
  },
  heal: {
    yellow: createImage("../../assets/towers/tower_heal_yellow.svg"),
    red: createImage("../../assets/towers/tower_heal_red.svg")
  },
  bomb: {
    yellow: createImage("../../assets/towers/tower_bomb_yellow.svg"),
    red: createImage("../../assets/towers/tower_bomb_red.svg")
  },
  propel: {
    yellow: createImage("../../assets/towers/tower_propel_yellow.svg"),
    red: createImage("../../assets/towers/tower_propel_red.svg")
  },
  streamer: {
    yellow: createImage("../../assets/towers/tower_streamer_yellow.svg"),
    red: createImage("../../assets/towers/tower_streamer_red.svg")
  },
  drown: {
    yellow: createImage("../../assets/towers/tower_drown_yellow.svg"),
    red: createImage("../../assets/towers/tower_drown_red.svg")
  },
  splinter: {
    yellow: createImage("../../assets/towers/tower_splinter_yellow.svg"),
    red: createImage("../../assets/towers/tower_splinter_red.svg")
  },
  observatory: {
    yellow: createImage("../../assets/towers/tower_observatory_yellow.svg"),
    red: createImage("../../assets/towers/tower_observatory_red.svg")
  },
  
  
}
const IconSprites = {
  energy: createImage("../../assets/icons/logo_energy.svg"),
  health: createImage("../../assets/icons/logo_health.svg")
}





export function Render(gameData, ctx, canvas, held, mouse, canPlace, leaderboard, gameMessages, deathScreenOpacity) {
  ctx.fillStyle = "rgb(180, 180, 180)"
  ctx.fillRect(0, 0, canvas.width, canvas.height);




  //Save current state of canvas
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

  //Draw grid
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

  for (let id of Object.keys(gameData.towers)) {
    //Draw tower aura
    const tower = gameData.towers[id];
    ctx.lineWidth = 3;
    if (tower.auraRadius != 0) {
      if (tower.x != null && tower.y != null) {
        if (tower.x > gameData.you.x - canvas.width / 2 * 1 / gameData.you.fov - 100 - tower.auraRadius && tower.x < gameData.you.x + canvas.width / 2 * 1 / gameData.you.fov + 100 + tower.auraRadius && tower.y > gameData.you.y - canvas.height / 2 * 1 / gameData.you.fov - 120 - tower.auraRadius && tower.y < gameData.you.y + canvas.height / 2 * 1 / gameData.you.fov + 120 + tower.auraRadius) {
          if (tower.parentId != gameData.you.id) {
            //Draw Tower (not urs)

            ctx.translate(tower.x, tower.y)
            ctx.rotate(tower.auraDir)
            //Draw Heal Tower
            if (tower.type === "heal") {
              ctx.globalAlpha = 0.3;
              ctx.fillStyle = "#e08080";
            }
            if (tower.type === "drown"){
              ctx.globalAlpha = 0.4;
              ctx.fillStyle = "#34568c";
            }
            ctx.beginPath();
            ctx.arc(0, 0, tower.auraRadius, 0, Math.PI * 2)
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.setLineDash([10, 15]);
            if (tower.type === "heal") {
              ctx.strokeStyle = "#ff0000";
            }
            if (tower.type === "drown"){
              ctx.strokeStyle = "#002fba";
            }
            ctx.beginPath();
            ctx.arc(0, 0, tower.auraRadius, 0, Math.PI * 2)
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.rotate(-tower.auraDir)
            ctx.translate(-tower.x, -tower.y)

            tower.auraDir += 1 / 160;
          }
          else {
            ctx.translate(tower.x, tower.y)
            ctx.rotate(tower.auraDir)
            //Draw Heal Tower or other towers with radius
            if (tower.type === "heal") {
              ctx.globalAlpha = 0.3;
              ctx.fillStyle = "#c4bd72";
            }
            if (tower.type === "drown"){
              ctx.globalAlpha = 0.2;
              ctx.fillStyle = "#5c8fe0"
            }
            ctx.beginPath();
            ctx.arc(0, 0, tower.auraRadius, 0, Math.PI * 2)
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.setLineDash([10, 15]);
            if (tower.type === "heal") {
              ctx.strokeStyle = "#a6ad1f";
            }
            if (tower.type === "drown"){
              ctx.strokeStyle = "#2e4870";
            }
            ctx.beginPath();
            ctx.arc(0, 0, tower.auraRadius, 0, Math.PI * 2)
            ctx.stroke();
            ctx.setLineDash([]);


            ctx.rotate(-tower.auraDir)
            ctx.translate(-tower.x, -tower.y)
            tower.auraDir += 1 / 160;
          }
        }
      }
    }
  }



  for (let id of Object.keys(gameData.bullets)) {
    const bullet = gameData.bullets[id];
    let alpha = bullet.opacity;
    if (bullet.type === "bomb"){
      alpha /= (bullet.size/bullet.baseSize);
    }
    ctx.globalAlpha = alpha;
    if (bullet.parentId != gameData.you.id) {
      //not your bullet :c
      ctx.drawImage(BulletSprites[bullet.type].red, bullet.x - bullet.size, bullet.y - bullet.size, bullet.size * 2, bullet.size * 2);
    }
    else {
      //your bullet c:
      ctx.drawImage(BulletSprites[bullet.type].yellow, bullet.x - bullet.size, bullet.y - bullet.size, bullet.size * 2, bullet.size * 2);
    }
  }
  ctx.globalAlpha = 1;
  //Draw Towers
  ctx.lineCap = "round";

  for (let id of Object.keys(gameData.towers)) {
    //Draw tower itself
    const tower = gameData.towers[id];
    if (tower.x != null && tower.y != null) {
      if (tower.x > gameData.you.x - canvas.width / 2 * 1 / gameData.you.fov - 100 - tower.auraRadius && tower.x < gameData.you.x + canvas.width / 2 * 1 / gameData.you.fov + 100 + tower.auraRadius && tower.y > gameData.you.y - canvas.height / 2 * 1 / gameData.you.fov - 120 - tower.auraRadius && tower.y < gameData.you.y + canvas.height / 2 * 1 / gameData.you.fov + 120 + tower.auraRadius) {
        //Check if tower is owned by you or not
        if (tower.parentId != gameData.you.id) {
          //Draw Tower (not urs)

          ctx.translate(tower.x, tower.y)
          ctx.rotate(tower.dir)
          //Draw Tower itself
          ctx.drawImage(TowerSprites[tower.type].red, - tower.size, - tower.size, tower.size * 2, tower.size * 2);

          ctx.rotate(-tower.dir);
          ctx.translate(-tower.x, -tower.y)
          //Hp Bar
          ctx.lineWidth = 10;
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          ctx.moveTo(tower.x - tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.lineTo(tower.x + tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.stroke();
          ctx.lineWidth = 8;
          ctx.strokeStyle = "#a65033";
          ctx.beginPath();
          ctx.moveTo(tower.x - tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.lineTo(tower.x - tower.size / 2 + (tower.size * tower.hp / tower.maxHP), tower.y + tower.size / 2 + 10);
          ctx.stroke();
        }
        else {
          //Draw Tower (urs)


          ctx.translate(tower.x, tower.y)
          ctx.rotate(tower.dir)
          ctx.drawImage(TowerSprites[tower.type].yellow, - tower.size, - tower.size, tower.size * 2, tower.size * 2);
          ctx.rotate(-tower.dir);
          ctx.translate(-tower.x, -tower.y)
          //Hp Bar
          ctx.lineWidth = 10;
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          ctx.moveTo(tower.x - tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.lineTo(tower.x + tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.stroke();
          ctx.lineWidth = 8;
          ctx.strokeStyle = "#45a633";
          ctx.beginPath();
          ctx.moveTo(tower.x - tower.size / 2, tower.y + tower.size / 2 + 10);
          ctx.lineTo(tower.x - tower.size / 2 + (tower.size * tower.hp / tower.maxHP), tower.y + tower.size / 2 + 10);
          ctx.stroke();
        }
      }
    }
  }


  //Draw Players
  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.font = "20px Arial";
  for (let id of Object.keys(players)) {
    const player = players[id];
    if (player.x != null && player.y != null) {
      if (gameData.you.dead != true || id != gameData.you.id) {
        //Spawn Protection Alpha
        if (player.spawnProt == 1){
        ctx.globalAlpha = 0.4;
        }
        else{
        ctx.globalAlpha = 1;
        }
        //Player Body
        ctx.drawImage(ElementSprites[player.element], player.x - player.size, player.y - player.size, player.size * 2, player.size * 2)
        //Name
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "20px Arial";
        ctx.fillText(player.name, player.x, player.y + player.size + 15);

        //Set GlobalAlpha back to 1
        ctx.globalAlpha = 1;


        //Redness upon Damaged
        if (player.redFlash > 0) {
          ctx.globalAlpha = player.redFlash / 1.5;
          ctx.fillStyle = "rgb(200, 0, 0)"
          ctx.beginPath();
          ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = player.chatOpacity;
        ctx.font = "25px Arial";
        let chatWidth = ctx.measureText(player.chatMessage).width;
        roundRect(ctx, player.x - chatWidth/2 - 5, player.y - player.size - 33, player.x + chatWidth/2 + 5, player.y - player.size - 4, 3, "rgba(60, 60, 60)");
        ctx.fillStyle = "white";
        ctx.fillText(player.chatMessage, player.x, player.y - player.size - 11);

        ctx.globalAlpha = 1;
      }
    }
  }



  ctx.translate(-(-gameData.you.x + (canvas.width / 2) * 1 / gameData.you.fov), -(-gameData.you.y + (canvas.height / 2) * 1 / gameData.you.fov));
  ctx.scale(1 / gameData.you.fov, 1 / gameData.you.fov)

  if (gameData.you.dead != true) {
    //Draw Energy Bar
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

    //Draw leaderboard

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(30, 30, 310, (leaderboard.length + 1) * 40 + 13);
    ctx.textAlign = "left";
    ctx.font = "28px Arial";
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillText(
      "Leaderboard",
      45,
      64
    );
    ctx.font = "25px Arial";
    for (let i of leaderboard) {
      //Draw LB
      if (i.id != gameData.you.id) {
        try {
          i.name = gameData.players[i.id].shortName;
        }
        catch (err) {

        }
        ctx.fillStyle = "rgb(220, 220, 220)";
      }
      else {
        try {
          i.name = gameData.you.shortName;
        }
        catch (err) {

        }
        ctx.fillStyle = "#f0ee92";
      }
      ctx.fillText(
        i.place + ". " + i.name + ": " + i.xp,
        45,
        104 + (leaderboard.indexOf(i)) * 40
      );
    }
    ctx.textAlign = "center";

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

      if (mouse.x > slotX - 40 && mouse.x < slotX + 40 && mouse.y > 800 && mouse.y < 880) {
        ctx.globalAlpha = 0.7;
        ctx.font = "19px Arial";
        ctx.fillRect(slotX - 120, 660, 240, 130)
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgb(240, 240, 240)"
        ctx.font = "bold 32px Arial";
        ctx.fillText(capFirst(towerSlots[i]), slotX, 710)
        ctx.font = "19px Arial";
        ctx.fillText(TowerDescriptions[towerSlots[i]], slotX, 735);
        ctx.font = "13px Arial";
        ctx.fillText("Energy Required", slotX, 760)

        //mini Health bar
        ctx.lineCap = "round";
        ctx.lineWidth = 10;
        ctx.strokeStyle = "rgb(140, 140, 140)"
        ctx.beginPath();
        ctx.moveTo(slotX - 112, 772)
        ctx.lineTo(slotX + 112, 772)
        ctx.stroke();
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#e7cc47"
        ctx.beginPath();
        ctx.moveTo(slotX - 112, 772)
        ctx.lineTo(slotX - 112 + 226 * (TowerStats[towerSlots[i]].energy / gameData.you.maxEnergy), 772)
        ctx.stroke();
      }

    }

    //Draw Minimap
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.globalAlpha = 0.2;
    ctx.fillRect(20, 680, 200, 200)

    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 0, 0)"
    ctx.globalAlpha = 0.5;
    ctx.arc(20 + 200*gameData.you.x/gameData.arenaWidth, 680+200*gameData.you.y/gameData.arenaHeight, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    //Draw thing that you are holding (when placing towers)
    if (held != false) {
      ctx.globalAlpha = 0.4;
      let towerSize = TowerStats[held].size || 40;

      ctx.drawImage(TowerSprites[held].yellow, mouse.x - towerSize*2 * gameData.you.fov, mouse.y - towerSize*2 * gameData.you.fov, towerSize*4 * gameData.you.fov, towerSize*4 * gameData.you.fov);



      if (canPlace === false) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 0, 0)"
        ctx.arc(mouse.x, mouse.y, towerSize * gameData.you.fov, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.arc(800, 450, 400 * gameData.you.fov, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
    }

    //Draw XP Bar

    //Calculate XP Needed & Progress
    let xpTier = 0;
    while(true){
      if (xpTier >= TierXP.length){
        break;
      }
      if (gameData.you.xp < TierXP[xpTier+1]){
        break;
      }
      xpTier ++;
    }
    let lastXP = TierXP[xpTier];
    let nextXP = TierXP[xpTier + 1];
    let progress = gameData.you.xp - lastXP;
    let xpNeeded = nextXP - lastXP;
    
    //Draw
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 0, 0)"
    ctx.lineWidth = 20;
    ctx.moveTo(1550, 100);
    ctx.lineTo(1550, 800);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "#42c2f5"
    ctx.lineWidth = 16;
    ctx.moveTo(1550, 800-(progress/xpNeeded*700));
    ctx.lineTo(1550, 800);
    ctx.stroke();
    if (xpTier >= ElementTiers[gameData.you.element].tier){
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillText("Choose Your Element", 800, 65)
      //Draw Element Upgrades
      let upgrades = ElementTiers[gameData.you.element].upgrades;
      let upgradesAmount = upgrades.length;
      let upgradesLength = upgrades.length - 1;
      for (let i = 0; i < upgradesAmount; i++) {
        let slotX = 800 - (upgradesLength / 2) * 120 + i * 120;
        ctx.fillStyle = upgrades[i].color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(slotX - 50, 100, 100, 100)
        
        ctx.globalAlpha = 1;
        ctx.font = "bold 30px Arial";
        ctx.fillText(capFirst(upgrades[i].name), slotX, 160);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillText(capFirst(upgrades[i].name), slotX, 160);

        if (mouse.x > slotX - 50 && mouse.x < slotX + 50 && mouse.y > 100 && mouse.y < 200){
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(slotX - 50, 100, 100, 100)
        }

        ctx.globalAlpha = 1;
        
      }
    }
  }


  //You are dead, what a noob
  if (gameData.you.dead) {
    ctx.globalAlpha = deathScreenOpacity;
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, 1600, 900);
    ctx.globalAlpha = deathScreenOpacity*2;
    ctx.font = "60px Arial";
    ctx.fillStyle = "rgb(240, 240, 240)"
    ctx.fillText("You were killed by " + gameData.you.killer, 800, 300);
		ctx.fillStyle = "rgb(230, 230, 230)"
    ctx.font = "40px Arial";
    ctx.fillText("Final score: " + gameData.you.finalScore, 800, 620);
		ctx.fillStyle = "rgb(240, 240, 240)"
    ctx.font = "50px Arial";
    ctx.fillText("[ Space to Respawn ]", 800, 740)
    ctx.globalAlpha = 1;
  }

  //Draw game messages (like you killed player)
  for(let i in gameMessages){
    const gameMessage = gameMessages[i];
    ctx.globalAlpha = Math.max(Math.min(gameMessage.timer*2, 1), 0);
    ctx.font = "35px Arial";
    let msgWidth = ctx.measureText(gameMessage.value).width;
    ctx.fillStyle = "rgb(50, 50, 50)"
    ctx.fillRect(800 -msgWidth/2 - 8, 40+i*50, msgWidth + 16, 40);
    ctx.fillStyle = "rgb(230, 230, 230)"
    ctx.fillText(gameMessage.value, 800, 70 + i * 50);
    ctx.globalAlpha = 1;
  }

}