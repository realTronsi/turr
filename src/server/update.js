const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");
const { dist } = require("./utils/dist");
const { reduce_num } = require("./utils/numred");
const { TowerStats, ElementStats } = require("./stats");
const { Bullet } = require("./objects.js");
const { spawnWave } = require("./waves.js");
const { etToStr, strToEt } = require("./utils/etcast");
const lineIntersects = require("./utils/lineIntersect");

/* TOWER REQUIRE */

const basicTower = require("./towers/basic");
const bombTower = require("./towers/bomb");
const drownTower = require("./towers/drown");
const farmTower = require("./towers/farm");
const healTower = require("./towers/heal");
const splinterTower = require("./towers/splinter");
const streamerTower = require("./towers/streamer");
const volcanoTower = require("./towers/volcano");
const slingshotTower = require("./towers/slingshot");
const iceGunnerTower = require("./towers/icegunner");
const ionizerTower = require("./towers/ionizer");
const teslaCoilTower = require("./towers/teslacoil");
const cannonTower = require("./towers/cannon");
const laserTower = require("./towers/laser");
const toxicatorTower = require("./towers/toxicator")
const blowerTower = require("./towers/blower")

/* BULLET REQUIRE */

const basicBullet = require("./bullets/basic");
const bombBullet = require("./bullets/bomb");
const splinterBullet = require("./bullets/splinter");
const waterBullet = require("./bullets/water");
const rockBullet = require("./bullets/rock");
const iceBullet = require("./bullets/ice");
const plasmaBullet = require("./bullets/plasma");
const electricityBullet = require("./bullets/electricity");
const cannonballBullet = require("./bullets/cannonball");
const beamBullet = require("./bullets/beam");
const poisonBullet = require("./bullets/poison")
const airBullet = require("./bullets/air")

/* ENEMY REQUIRE */

const soldierEnemy = require("./enemies/soldier")
const archerEnemy = require("./enemies/archer")
const ninjaEnemy = require("./enemies/ninja")
const strongEnemy = require("./enemies/strong")
const machinegunnerEnemy = require("./enemies/machinegunner");
const tadpoleEnemy = require("./enemies/tadpole");
const frogEnemy = require("./enemies/frog");

function update(arenas, delta) { // main game loop
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];

    if (arena.gamemode == "defense" && arena.playerCount != 0) {
      if (arena.timer != Infinity) {
        arena.timer -= delta / 1000;
        if (Math.trunc(arena.timer) != Math.trunc(arena.lastTimer)) {
          // send update
          for (let i of Object.keys(arena.players)) {
            const player = arena.players[i];
            const payLoad = {
              t: "tm", // timer
              c: Math.trunc(arena.timer)
            }
            player.ws.send(msgpack.encode(payLoad))
          }
          arena.lastTimer = arena.timer;
        }
      }
      if (arena.timer < 0) {
        arena.wave++;
        spawnWave(arena);
        arena.announce("Wave " + arena.wave + " has started!")
        arena.timer = Infinity;
        for (let i of Object.keys(arena.players)) {
          const player = arena.players[i];
          const payLoad = {
            t: "sw", // started wave 
            w: arena.wave
          }
          player.ws.send(msgpack.encode(payLoad))
        }
      }
      if (arena.timer == Infinity && Object.keys(arena.enemies).length == 0) {
        arena.timer = arena.betweenWaves;
        arena.announce("You have passed wave " + arena.wave + "!")
        for (let i of Object.keys(arena.players)) {
          const player = arena.players[i];
          const payLoad = {
            t: "pw", // passed wave
            tim: arena.betweenWaves
          }
          player.ws.send(msgpack.encode(payLoad))
        }
      }


    }
    if (arena.joinQueue.length > 0) {
      for (let client of arena.joinQueue) {
        arena.addPlayer(client);
        updateArenaLeaderboard(arena);
      }
      arena.joinQueue = [];
    }

    // leave queue
    for (let client of arena.closequeue) {
      if (arena != undefined && client != undefined) {
        delete arena.players[client.gameId];

        //Delete player in Quadtree
        let deleteQtPlayer = arena.playerqt.find(function(element) {
          return element.gameId === client.gameId
        })
        if (deleteQtPlayer.length > 0) {
          arena.playerqt.remove(deleteQtPlayer[0]);
        }
        arena.playerCount = Object.keys(arena.players).length;

        //Delete player in Team
        if (arena.gamemode == "team") {
          if (arena.teams[client.team].includes(client)) {
            arena.teams[client.team].splice(arena.teams[client.team].indexOf(client), 1);
          }
        }



        for (let i of Object.keys(arena.players)) {
          const player = arena.players[i];
          const payLoad = {
            t: "pl",
            g: client.gameId
          }
          player.ws.send(msgpack.encode(payLoad))
        }
      }
    }
    arena.closequeue = [];

    // PLAYERS UPDATE
    let tempqt = new Quadtree({
      width: arena.width,
      height: arena.height,
      maxElements: 5
    });
    for (let p of Object.keys(arena.players)) {
      const player = arena.players[p];
      player.isDamaged = false;
      player.canPlaceLast = player.canPlace;
      player.canPlace = true;
      let foundQtPlayer = arena.playerqt.find(function(element) {
        return element.gameId === player.gameId
      })
      let qtPlayer;
      if (foundQtPlayer.length > 0) {
        qtPlayer = foundQtPlayer[0];
      }

      if (player.state == "dead") {
        if (player.killedBy.id != null) {
          // follow killer
          player.x = player.killedBy.x;
          player.y = player.killedBy.y;
          player.changed["x"] = true;
          player.changed["y"] = true;
        }
      } else {

        // ATTRIBUTES //

        if (player.spawnProt > 0) {
          player.spawnProt -= delta / 25;
          player.spawnProt = Math.max(player.spawnProt, 0);

          if (player.spawnProt <= 0) {
            player.changed["spawnProt"] = true;
          }
        }

        player.chatTimer -= delta / 1000;
        player.chatTimer = Math.max(player.chatTimer, 0);

        if (player.chatMessage != "" && player.chatTimer <= 0) {
          const payLoad = {
            t: "dch",
            i: player.gameId
          }
          for (let pl of Object.keys(arena.players)) {
            arena.players[pl].ws.send(msgpack.encode(payLoad));
          }
          player.chatMessage = "";
        }

        player.changed["energy"] = true;
        if (player.energy >= player.stats.maxEnergy) {
          player.changed["energy"] = false;
        }
        player.energy += 0.006 * delta;
        player.energy = Math.min(player.energy, player.stats.maxEnergy);
        player.changed["health"] = true;
        if (player.hp >= player.stats.defense) {
          player.changed["health"] = false;
        }
        player.hp += 0.001 * delta;
        player.hp = Math.min(player.hp, player.stats.defense);

        // MOVEMENT //

        let normalizedxv = 0;
        let normalizedyv = 0;
        if (player.keys["ArrowLeft"] || player.keys["a"]) {
          normalizedxv = -1;
        }
        if (player.keys["ArrowRight"] || player.keys["d"]) {
          normalizedxv = 1;
        }
        if (player.keys["ArrowDown"] || player.keys["s"]) {
          normalizedyv = 1;
        }
        if (player.keys["ArrowUp"] || player.keys["w"]) {
          normalizedyv = -1;
        }

        const normalize_magnetitude = Math.sqrt(normalizedxv * normalizedxv + normalizedyv * normalizedyv);

        normalizedxv /= (normalize_magnetitude || 1);
        normalizedyv /= (normalize_magnetitude || 1);

        player.xv += normalizedxv * player.stats.speed;
        player.yv += normalizedyv * player.stats.speed;

        player.xv *= Math.pow(player.stats.friction, delta / 25);
        player.yv *= Math.pow(player.stats.friction, delta / 25);
        player.bxv *= Math.pow(player.bfric, delta / 25);
        player.byv *= Math.pow(player.bfric, delta / 25);



        if (Math.abs(player.xv) < 0.06) {
          player.xv = 0;
        }
        if (Math.abs(player.yv) < 0.06) {
          player.yv = 0;
        }
        if (Math.abs(player.bxv) < 0.06) {
          player.bxv = 0;
        }
        if (Math.abs(player.byv) < 0.06) {
          player.byv = 0;
        }

        if (player.xv != 0 || player.bxv != 0) {
          player.changed["x"] = true;
        }
        if (player.yv != 0 || player.byv != 0) {
          player.changed["y"] = true;
        }

        if (player.effects.poison != null && player.effects.poison != undefined) {
          player.effects.poison.duration -= delta;
          player.effects.poison.reload -= delta;
          while (player.effects.poison.reload <= 0) {
            player.effects.poison.reload += 500;
            player.hp -= player.effects.poison.effect;
            player.changed["poison"] = true;
            if (player.hp <= 0) {
              // collider died
              player.die(arena, player.effects.poison.parent);
              let deleteQtPlayer = arena.playerqt.find(function(element) {
                return element.gameId === player.gameId
              })
              if (deleteQtPlayer.length > 0) {
                arena.playerqt.remove(deleteQtPlayer[0]);
              }

            }
          }
          if (player.effects.poison.duration <= 0) {
            player.effects.poison = null;
          }

					/*
					poison.duration and poison.effect, dmg every 1 second
					*/
        }

        if (player.effects.frozen <= 0) {


					/*
					very bugged friction independent movement ->  * (drag^(dt*dt) - 1) / (dt*ln(drag));
					*/

          player.x += player.xv * delta / 25 * player.effects.drowned / 100;
          player.y += player.yv * delta / 25 * player.effects.drowned / 100;


          player.x += player.bxv * delta / 25 * player.effects.drowned / 100;
          player.y += player.byv * delta / 25 * player.effects.drowned / 100;

        }

        // tower collision

        let inObservatory = player.effects.observatory == 0 ? false : true;

        player.effects.observatory = 0;

        if (inObservatory) {
          player.fov = ElementStats[player.element].fov;
          player.changed["fov"] = true;
        }


        arena.towerqt.onCollision({
          x: player.x - player.size,
          y: player.y - player.size,
          width: player.size * 2,
          height: player.size * 2
        }, function(tower) {
          let towerObject = arena.towers[tower.id];
          if (towerObject.collide != false) {
            if (towerObject.type == "observatory") {
              if (arena.gamemode == "team" || arena.gamemode == "defense") {
                if (towerObject.team == player.team) {
                  if (inObservatory == true) {
                    player.changed["fov"] = false;
                  } else {
                    player.changed["fov"] = true;
                  }
                  player.effects.observatory = towerObject.effect;
                  let angle = Math.atan2(towerObject.y - player.y, towerObject.x - player.x);
                  let dist = Math.sqrt(Math.pow(towerObject.x - player.x, 2) + Math.pow(towerObject.y - player.y, 2));
                  player.xv += 82 * Math.cos(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                  player.yv += 82 * Math.sin(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                }
              } else {
                if (towerObject.parentId == player.gameId) {
                  if (inObservatory == true) {
                    player.changed["fov"] = false;
                  } else {
                    player.changed["fov"] = true;
                  }
                  player.effects.observatory = towerObject.effect;
                  let angle = Math.atan2(towerObject.y - player.y, towerObject.x - player.x);
                  let dist = Math.sqrt(Math.pow(towerObject.x - player.x, 2) + Math.pow(towerObject.y - player.y, 2));
                  player.xv += 82 * Math.cos(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                  player.yv += 82 * Math.sin(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                } else {
                  let dx = player.x - towerObject.x;
                  let dy = player.y - towerObject.y;
                  let l = Math.sqrt(dx * dx + dy * dy) || 1;
                  let xv = dx / l;
                  let yv = dy / l;
                  player.x = towerObject.x + (towerObject.size + 0.01 + player.size) * xv;
                  player.y = towerObject.y + (towerObject.size + 0.01 + player.size) * yv;

                  player.changed["x"] = true;
                  player.changed["y"] = true;
                }
              }
            } else if (towerObject.type == "base") {
              if (arena.gamemode == "defense") {
                if (towerObject.team == player.team) {
                  let angle = Math.atan2(towerObject.y - player.y, towerObject.x - player.x);
                  let dist = Math.sqrt(Math.pow(towerObject.x - player.x, 2) + Math.pow(towerObject.y - player.y, 2));
                  if (dist > towerObject.size * 2/3) {
                    player.xv += 22 * Math.cos(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                    player.yv += 22 * Math.sin(angle) * delta / 1000 * dist / 50 * player.stats.speed / 12;
                  }
                  player.canPlace = false;
                  player.spawnProt = 1;
                }
              }
            } else {
              let dx = player.x - towerObject.x;
              let dy = player.y - towerObject.y;
              let l = Math.sqrt(dx * dx + dy * dy) || 1;
              let xv = dx / l;
              let yv = dy / l;
              player.x = towerObject.x + (towerObject.size + 0.01 + player.size) * xv;
              player.y = towerObject.y + (towerObject.size + 0.01 + player.size) * yv;

              player.changed["x"] = true;
              player.changed["y"] = true;
            }
          }

          if (towerObject.type == "propel") {
            // boost code here :P
            if (player.xv != 0 || player.yv != 0) {
              if (arena.gamemode == "team" || arena.gamemode == "defense") {
                if (towerObject.team === player.team) {
                  let angle = Math.atan2(player.yv, player.xv);
                  player.bxv = Math.cos(angle) * towerObject.effect;
                  player.byv = Math.sin(angle) * towerObject.effect;
                }
              } else {
                if (towerObject.parentId === player.gameId) {
                  let angle = Math.atan2(player.yv, player.xv);
                  player.bxv = Math.cos(angle) * towerObject.effect;
                  player.byv = Math.sin(angle) * towerObject.effect;
                }
              }
            }
          }
        }, function(element1, element2) {
          return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
        });



        // wall collision
        let lastX = player.x;
        let lastY = player.y;
        player.x = Math.min(Math.max(player.x, player.size), arena.width - player.size)
        player.y = Math.min(Math.max(player.y, player.size), arena.height - player.size)
        if (lastX != player.x) {
          player.changed["x"] = true;
        }
        if (lastY != player.y) {
          player.changed["y"] = true;
        }

				// zone collision

				if(dist(player.x, player.y, arena.width/2, arena.height/2) > arena.zone){
					player.hp -= delta/6;
					player.isDamaged = true;
					if (player.hp <= 0) {
						// collider died
						player.die(arena, null, "The Zone");
            //idk if theres need for this cuz it already happesn in player.die code
						let deleteQtPlayer = arena.playerqt.find(function(element) {
							return element.gameId === player.gameId
						})
						if (deleteQtPlayer.length > 0) {
							arena.playerqt.remove(deleteQtPlayer[0]);
						}
					}
				}

        if (qtPlayer != undefined) {
          qtPlayer.x = player.x - player.size;
          qtPlayer.y = player.y - player.size;
        }

        if (player.effects.observatory > 0) {
          player.fov *= player.effects.observatory;
        }


        player.effects.drowned = 100;
        player.effects.frozen -= delta / 1000;
        tempqt.push(qtPlayer);
      }
    }
    arena.playerqt = tempqt;

    // TOWERS UPDATE
    for (let t of Object.keys(arena.towers)) {
      const tower = arena.towers[t];

      tower.changed = {};

      if (arena.timer != Infinity || tower.type != "base"){
        tower.hp -= tower.decay * delta;
      }

      

      if (tower.hp > tower.maxHP) {
        tower.hp = tower.maxHP;
      }

      if (tower.type == "farm") {
        farmTower(arena, tower, delta);
      } else if (tower.type == "basic") {
        basicTower(arena, tower, delta);
      } else if (tower.type == "heal") {
        healTower(arena, tower, delta);
      } else if (tower.type == "bomb") {
        bombTower(arena, tower, delta);
      } else if (tower.type == "streamer") {
        streamerTower(arena, tower, delta);
      } else if (tower.type == "drown") {
        drownTower(arena, tower, delta);
      } else if (tower.type == "splinter") {
        splinterTower(arena, tower, delta);
      } else if (tower.type == "volcano") {
        volcanoTower(arena, tower, delta);
      } else if (tower.type == "slingshot") {
        slingshotTower(arena, tower, delta);
      } else if (tower.type == "ice gunner") {
        iceGunnerTower(arena, tower, delta);
      } else if (tower.type == "ionizer") {
        ionizerTower(arena, tower, delta);
      } else if (tower.type == "tesla coil") {
        teslaCoilTower(arena, tower, delta);
      } else if (tower.type == "cannon") {
        cannonTower(arena, tower, delta);
      } else if (tower.type == "laser") {
        laserTower(arena, tower, delta);
      } else if (tower.type == "toxicator") {
        toxicatorTower(arena, tower, delta);
      } else if (tower.type == "blower") {
        blowerTower(arena, tower, delta)
      }


      if (tower.hp <= 0) {
        // tower dead
        let deleteQtTower = arena.towerqt.find(function(element) {
          return element.id === tower.id
        })
        if (deleteQtTower.length > 0) {
          arena.towerqt.remove(deleteQtTower[0]);
        }
        for (let player of tower.seenBy) {
          const payLoad = {
            t: "rt", //remove tower
            id: tower.id
          }
          player.ws.send(msgpack.encode(payLoad))
        }

        delete arena.towers[t];
      }
    }

    tempqt = new Quadtree({
      width: arena.width,
      height: arena.height,
      maxElements: 5
    });

    //ENEMIES UPDATE
    for (let en of Object.keys(arena.enemies)) {
      const enemy = arena.enemies[en];

      let foundQtEnemy = arena.enemyqt.find(function(element) {
        return element.id === enemy.id
      });
      let qtEnemy;
      if (foundQtEnemy.length > 0) {
        qtEnemy = foundQtEnemy[0];
      }

      switch (enemy.type) {
        case "soldier": {
          soldierEnemy(arena, enemy, delta);
          break;
        }
        case "ninja": {
          ninjaEnemy(arena, enemy, delta)
          break;
        }
        case "strong": {
          strongEnemy(arena, enemy, delta)
          break;
        }
				case "machine gunner": {
					machinegunnerEnemy(arena, enemy, delta);
					break;
				}
        case "archer": {
          archerEnemy(arena, enemy, delta);
          break;
        }
        case "tadpole": {
          tadpoleEnemy(arena, enemy, delta);
          break;
        }
        case "frog": {
          frogEnemy(arena, enemy, delta);
          break;
        }
      }

      enemy.bxv *= Math.pow(enemy.bfric, delta / 25);
      enemy.byv *= Math.pow(enemy.bfric, delta / 25);
      enemy.boostxv *= Math.pow(enemy.boostfric, delta / 25);
      enemy.boostyv *= Math.pow(enemy.boostfric, delta / 25);


      if (Math.abs(enemy.bxv) < 0.06) {
        enemy.bxv = 0;
      }
      if (Math.abs(enemy.byv) < 0.06) {
        enemy.byv = 0;
      }
      if (Math.abs(enemy.boostxv) < 0.06) {
        enemy.bxv = 0;
      }
      if (Math.abs(enemy.boostyv) < 0.06) {
        enemy.byv = 0;
      }

      if (enemy.xv != 0 || enemy.bxv != 0 || enemy.boostxv != 0) {
        enemy.changed["x"] = true;
      }
      if (enemy.yv != 0 || enemy.byv != 0 || enemy.boostyv != 0) {
        enemy.changed["y"] = true;
      }

      enemy.effects.frozen -= delta/1000;

        if (enemy.effects.poison != null && enemy.effects.poison != undefined) {
          enemy.effects.poison.duration -= delta;
          enemy.effects.poison.reload -= delta;
          while (enemy.effects.poison.reload <= 0) {
            enemy.effects.poison.reload += 500;
            enemy.hp -= enemy.effects.poison.effect;
            enemy.changed["hp"] = true;
            if (enemy.hp <= 0) {
              // enemy died
              enemy.die(arena, enemy.effects.poison.parent);
            }
          }
          if (enemy.effects.poison.duration <= 0) {
            enemy.effects.poison = null;
          }

					/*
					poison.duration and poison.effect, dmg every 1 second
					*/
        }

      //Update Pos
      if (enemy.effects.frozen <= 0) {
        enemy.x += enemy.xv * delta * enemy.effects.drowned / 100;
        enemy.y += enemy.yv * delta * enemy.effects.drowned / 100;

        enemy.x += enemy.bxv * delta / 25 * enemy.effects.drowned / 100;
        enemy.y += enemy.byv * delta / 25 * enemy.effects.drowned / 100;

        enemy.x += enemy.boostxv * delta / 25 * enemy.effects.drowned / 100;
        enemy.y += enemy.boostyv * delta / 25 * enemy.effects.drowned / 100;

        
      }

      //player.bxv * delta / 25


      //Collide With Towers
      arena.towerqt.onCollision({
        x: enemy.x - enemy.stats.size,
        y: enemy.y - enemy.stats.size,
        width: enemy.stats.size * 2,
        height: enemy.stats.size * 2
      }, function(tower) {
        let towerObject = arena.towers[tower.id];
        let dx = enemy.x - towerObject.x;
        let dy = enemy.y - towerObject.y;
        let l = Math.sqrt(dx * dx + dy * dy) || 1;
        let xv = dx / l;
        let yv = dy / l;
        enemy.x = towerObject.x + (towerObject.size + 0.01 + enemy.stats.size) * xv;
        enemy.y = towerObject.y + (towerObject.size + 0.01 + enemy.stats.size) * yv;

        towerObject.hp -= enemy.stats.damage * delta / 1000;

      }, function(element1, element2) {
        return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
      });
      //Collide With Enemies
      arena.enemyqt.onCollision({
        x: enemy.x - enemy.stats.size,
        y: enemy.y - enemy.stats.size,
        width: enemy.stats.size * 2,
        height: enemy.stats.size * 2
      }, function(enemy2) {
        let enemyObject = arena.enemies[enemy2.id];
        if (enemy.stats.size < enemyObject.stats.size) {
          let dx = enemy.x - enemyObject.x;
          let dy = enemy.y - enemyObject.y;
          let l = Math.sqrt(dx * dx + dy * dy) || 1;
          let xv = dx / l;
          let yv = dy / l;
          enemy.x = enemyObject.x + (enemyObject.stats.size + 0.01 + enemy.stats.size) * xv;
          enemy.y = enemyObject.y + (enemyObject.stats.size + 0.01 + enemy.stats.size) * yv;
        }
        if (enemy.stats.size == enemyObject.stats.size) {
          let dx = enemy.x - enemyObject.x;
          let dy = enemy.y - enemyObject.y;
          let l = Math.sqrt(dx * dx + dy * dy) || 1;
          let xv = dx / l;
          let yv = dy / l;
          enemy.x = enemyObject.x + ((enemyObject.stats.size + 0.01 + enemy.stats.size) * xv);
          enemy.y = enemyObject.y + ((enemyObject.stats.size + 0.01 + enemy.stats.size) * yv);
          enemyObject.x = enemy.x - ((enemy.stats.size + 0.01 + enemyObject.stats.size) * xv);
          enemyObject.y = enemy.y - ((enemy.stats.size + 0.01 + enemyObject.stats.size) * yv);

        }

      }, function(element1, element2) {
        return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2 && element1.id != element2.id)
      });

      arena.playerqt.onCollision({
        x: enemy.x - enemy.stats.size,
        y: enemy.y - enemy.stats.size,
        width: enemy.stats.size * 2,
        height: enemy.stats.size * 2
      }, function(player) {
        let playerObject = arena.players[player.gameId];
        if (playerObject.spawnProt <= 0) {
          let dx = enemy.x - playerObject.x;
          let dy = enemy.y - playerObject.y;
          let l = Math.sqrt(dx * dx + dy * dy) || 1;
          let xv = dx / l;
          let yv = dy / l;
          enemy.x = playerObject.x + (playerObject.size + 0.01 + enemy.stats.size) * xv;
          enemy.y = playerObject.y + (playerObject.size + 0.01 + enemy.stats.size) * yv;

          playerObject.hp -= enemy.stats.damage * delta / 1000;
          if (enemy.stats.damage > 0){
            playerObject.isDamaged = true;
            playerObject.changed["health"] = true;
          }
          if (playerObject.hp <= 0) {
            // collider died
            playerObject.die(arena, null, "Enemy");
          }
        }

      }, function(element1, element2) {
        if (element1 == undefined || element2 == undefined) {
          console.log("UNDEFINED: ELEMENt 1 - ", element1, "element 2", element2)
          return false;
        }
        return (dist(element1.x + element1.width / 2, element1.y + element1.width / 2, element2.x + element2.width / 2, element2.y + element2.width / 2) < element1.width / 2 + element2.width / 2)
      });

			let lastX = enemy.x;
      let lastY = enemy.y;
      enemy.x = Math.min(Math.max(enemy.x, enemy.stats.size), arena.width - enemy.stats.size)
      enemy.y = Math.min(Math.max(enemy.y, enemy.stats.size), arena.height - enemy.stats.size)
      if (lastX != enemy.x) {
        enemy.changed["x"] = true;
      }
      if (lastY != enemy.y) {
        enemy.changed["y"] = true;
      }
      enemy.effects.drowned = 100;

      //Push to TempQuadtree
      if (qtEnemy != undefined) {
        qtEnemy.x = enemy.x - enemy.stats.size;
        qtEnemy.y = enemy.y - enemy.stats.size;
      }
      tempqt.push(qtEnemy);
    }
    arena.enemyqt = tempqt;

    //BULLETS UPDATE
    for (let b of Object.keys(arena.bullets)) {
      const bullet = arena.bullets[b];
      bullet.changed = {};

      switch (bullet.stats.type) {
        case "bomb": {
          bombBullet(arena, bullet, delta, b);
          break;
        }
        case "splinter": {
          splinterBullet(arena, bullet, delta, b);
          break;
        }
        case "water": {
          waterBullet(arena, bullet, delta, b);
          break;
        }
        case "basic": {
          basicBullet(arena, bullet, delta, b);
          break;
        }
        case "rock": {
          rockBullet(arena, bullet, delta, b);
          break;
        }
        case "ice": {
          iceBullet(arena, bullet, delta, b);
          break;
        }
        case "plasma": {
          plasmaBullet(arena, bullet, delta, b);
          break;
        }
        case "electricity": {
          electricityBullet(arena, bullet, delta, b);
          break;
        }
        case "cannonball": {
          cannonballBullet(arena, bullet, delta, b);
          break;
        }
        case "beam": {
          beamBullet(arena, bullet, delta, b);
          break;
        }
        case "poison": {
          poisonBullet(arena, bullet, delta, b);
          break;
        }
        case "air": {
          airBullet(arena, bullet, delta, b);
          break;
        }
        default: break;
      }
    }

  }
}

//

function sendToPlayers(arenas, delta) {
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];

    for (let p of Object.keys(arena.players)) {
      const player = arena.players[p];
      const playerUpdatePacks = [];
      const towerUpdatePacks = [];
      const bulletUpdatePacks = [];
      const enemyUpdatePacks = [];

      for (let k of Object.keys(arena.players)) {
        const candidate = arena.players[k];
        if (candidate.state == "dead") {
          if (candidate.id == player.id) {
            playerUpdatePacks.push(candidate.getUpdatePack());
          }
        } else if (Math.abs(candidate.x - player.x) <= 1 / player.fov * 800 + candidate.size && Math.abs(candidate.y - player.y) <= 1 / player.fov * 450 + candidate.size) { // make sure player is in fov
          let playerPack = {};
          if (!player.inFov.includes(candidate)) {
            // candidate just got into player fov
            player.inFov.push(candidate);
            playerPack = {
              g: candidate.gameId,
              x: candidate.x,
              y: candidate.y,
              el: strToEt[candidate.element],
              ip: 0
              // size and other attributes later
            };
            if (candidate.spawnProt > 0) {
              playerPack.sp = 1;
            }
          } else {
            playerPack = candidate.getUpdatePack();
          }
          if (Object.keys(playerPack).length > 0) {
            playerUpdatePacks.push(playerPack);
          }
        } else {
          if (player.inFov.includes(candidate)) {
            player.inFov.splice(player.inFov.indexOf(candidate), 1);
            playerUpdatePacks.push({
              g: candidate.gameId,
              ip: -1
            });
          }
        }
      }
      for (let t of Object.keys(arena.towers)) {
        const tower = arena.towers[t];
        if (Math.abs(tower.x - player.x) <= 1 / player.fov * 800 + tower.size && Math.abs(tower.y - player.y) <= 1 / player.fov * 450 + tower.size) { // make sure tower is in fov
          if (!tower.seenBy.includes(player)) {
            // player has never seen tower
            towerUpdatePacks.push(tower.getInitPack());
            tower.seenBy.push(player);
          } else {
            // player has seen tower
            towerUpdatePacks.push(tower.getUpdatePack());
          }
        }
      }
      for (let b of Object.keys(arena.bullets)) {
        const bullet = arena.bullets[b];
        if (bullet.stats.type == "beam") {
          // check if beam line intersects in fov
          //if(lineIntersects(bullet.stats.start.x, bullet.stats.start.y, bullet.stats.end.x, bullet.stats.end.y, player.x - 1 / player.fov * 800, player.y - 1 / player.fov * 450, player.x + 1 / player.fov * 800, player.y - 1 / player.fov * 450) || lineIntersects(bullet.stats.start.x, bullet.stats.start.y, bullet.stats.end.x, bullet.stats.end.y, player.x - 1 / player.fov * 800, player.y + 1 / player.fov * 450, player.x + 1 / player.fov * 800, player.y + 1 / player.fov * 450) || lineIntersects(bullet.stats.start.x, bullet.stats.start.y, bullet.stats.end.x, bullet.stats.end.y, player.x - 1 / player.fov * 800, player.y - 1 / player.fov * 450, player.x - 1 / player.fov * 800, player.y + 1 / player.fov * 450) || lineIntersects(bullet.stats.start.x, bullet.stats.start.y, bullet.stats.end.x, bullet.stats.end.y, player.x + 1 / player.fov * 800, player.y - 1 / player.fov * 450, player.x + 1 / player.fov * 800, player.y + 1 / player.fov * 450)){
          if (!bullet.seenBy.includes(player)) {
            //Bullet is re-entering fov or entering it for the first time
            bulletUpdatePacks.push(bullet.getInitPack());
            bullet.seenBy.push(player);
          } else {
            //Bullet has been in fov
            bulletUpdatePacks.push(bullet.getUpdatePack());
          }
          //} else {
          //if (bullet.seenBy.includes(player)) {
          //bullet.seenBy.splice(bullet.seenBy.indexOf(player), 1);
          //bulletUpdatePacks.push(bullet.getRemovePack());
          //}
          //}
        } else if (bullet.stats.type == "electricity") {
          // if cannot see electricity with small fov, its because we do not account for line segement colliding with fov since both nodes could be outside of fov while line still inside fov (see line segement intersect with rectangle)
          let infov = false;
          for (let node of bullet.stats.nodes) {
            if (Math.abs(node.x - player.x) <= 1 / player.fov * 800 && Math.abs(node.y - player.y) <= 1 / player.fov * 450) {
              infov = true;
              break;
            }
          }
          if (infov == true) {
            if (!bullet.seenBy.includes(player)) {
              //Bullet is re-entering fov or entering it for the first time
              bulletUpdatePacks.push(bullet.getInitPack());
              bullet.seenBy.push(player);
            }
            else {
              //Bullet has been in fov
              bulletUpdatePacks.push(bullet.getUpdatePack());
            }
          } else {
            if (bullet.seenBy.includes(player)) {
              bullet.seenBy.splice(bullet.seenBy.indexOf(player), 1);
              bulletUpdatePacks.push(bullet.getRemovePack());
            }
          }
        } else {
          if (Math.abs(bullet.x - player.x) <= 1 / player.fov * 800 + bullet.stats.size && Math.abs(bullet.y - player.y) <= 1 / player.fov * 450 + bullet.stats.size) {
            if (!bullet.seenBy.includes(player)) {
              //Bullet is re-entering fov or entering it for the first time
              bulletUpdatePacks.push(bullet.getInitPack());
              bullet.seenBy.push(player);
            } else {
              //Bullet has been in fov
              bulletUpdatePacks.push(bullet.getUpdatePack());
            }
          } else {
            if (bullet.seenBy.includes(player)) {
              bullet.seenBy.splice(bullet.seenBy.indexOf(player), 1);
              bulletUpdatePacks.push(bullet.getRemovePack());
            }
          }
        }
      }
      for (let en of Object.keys(arena.enemies)) {
        const enemy = arena.enemies[en];

        if (Math.abs(enemy.x - player.x) <= 1 / player.fov * 800 + enemy.stats.size && Math.abs(enemy.y - player.y) <= 1 / player.fov * 450 + enemy.stats.size) {
          if (!enemy.seenBy.includes(player)) {
            //Enemy is re-entering fov or entering it for the first time
            enemyUpdatePacks.push(enemy.getInitPack());
            enemy.seenBy.push(player);
          } else {
            //Enemy has been in fov
            enemyUpdatePacks.push(enemy.getUpdatePack());
          }
        } else {
          //Enemy is leaving fov
          if (enemy.seenBy.includes(player)) {
            enemy.seenBy.splice(enemy.seenBy.indexOf(player), 1);
            enemyUpdatePacks.push(enemy.getRemovePack());
          }
        }
      }

      let sendEnergy = player.changed["energy"];
      let sendHealth = player.changed["health"];
      let sendXP = player.changed["xp"];


      const payLoad = {
        t: "u",
        p: playerUpdatePacks,
        tp: towerUpdatePacks,
        bp: bulletUpdatePacks,
        ep: enemyUpdatePacks
      };
      if (sendEnergy) {
        payLoad.e = Math.round(player.energy * 10) / 10;
      }
      if (sendHealth) {
        payLoad.h = Math.round(player.hp * 10) / 10;
      }
      if (sendXP) {
        payLoad.xp = Math.round(player.xp);
      }
      if (player.canPlace != player.canPlaceLast) {
        payLoad.cp = Number(player.canPlace);
      }
      player.ws.send(msgpack.encode(payLoad));
    }
    for (let p of Object.keys(arena.players)) {
      arena.players[p].changed = {}; // reset changed properties
    }
    for (let b of Object.keys(arena.bullets)) {
      const bullet = arena.bullets[b];
      if (bullet.die == true) {
        const bullet = arena.bullets[b];
        for (let player of bullet.seenBy) {
          const payLoad = {
            t: "rb",
            i: bullet.id
          }
          player.ws.send(msgpack.encode(payLoad));
        }
        delete arena.bullets[b];
      }
    }
  }
}



// LEADERBOARD

function updateArenaLeaderboard(arena) {
  let scores = [];

  for (let p of Object.keys(arena.players)) {
    if (arena.players[p].state == "game") {
      scores.push({
        id: arena.players[p].gameId,
        xp: arena.players[p].xp
      });
    }
  }

  scores = scores.sort((a, b) => b.xp - a.xp);
  let place = 0;
  for (let i of scores) {
    place++;
    arena.players[i.id].place = place;
    i.place = place;
  }
  scores = scores.slice(0, 3);

  for (let score of scores) {
    score.xp = reduce_num(score.xp);
  }

  arena.lb = JSON.parse(JSON.stringify(scores));
  // lb changed
  for (let pp of Object.keys(arena.players)) {
    // check if they're in lb
    const payLoad = {
      t: "lb",
      lb: JSON.parse(JSON.stringify(scores))
    }
    if (arena.players[pp].place <= 3) {
      // in top 3
    } else {
      payLoad.lb.push({
        place: arena.players[pp].place,
        id: Number(pp),
        xp: reduce_num(arena.players[pp].xp)
      });
    }
    // send lb
    arena.players[pp].ws.send(msgpack.encode(payLoad));
  }
}

function updateLeaderboard(arenas) {
  for (let a of Object.keys(arenas)) {
    const arena = arenas[a];
    let scores = [];

    for (let p of Object.keys(arena.players)) {
      if (arena.players[p].state == "game") {
        scores.push({
          id: arena.players[p].gameId,
          xp: arena.players[p].xp
        });
      }
    }

    scores = scores.sort((a, b) => b.xp - a.xp);
    let place = 0;
    for (let i of scores) {
      place++;
      arena.players[i.id].place = place;
      i.place = place;
    }
    scores = scores.slice(0, 3);

    for (let score of scores) {
      score.xp = reduce_num(score.xp);
    }

    if (JSON.stringify(arena.lb) != JSON.stringify(scores)) {
      arena.lb = JSON.parse(JSON.stringify(scores));
      // lb changed
      for (let pp of Object.keys(arena.players)) {
        // check if they're in lb
        const payLoad = {
          t: "lb",
          lb: JSON.parse(JSON.stringify(scores))
        }
        if (arena.players[pp].place <= 3) {
          // in top 3
        } else {
          payLoad.lb.push({
            place: arena.players[pp].place,
            id: Number(pp),
            xp: reduce_num(arena.players[pp].xp)
          });
        }
        // send lb
        arena.players[pp].ws.send(msgpack.encode(payLoad));
      }
    }

  }
}

module.exports = { update, sendToPlayers, updateLeaderboard, updateArenaLeaderboard }