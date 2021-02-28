const msgpack = require("msgpack-lite");
const Quadtree = require("quadtree-lib");
const { dist } = require("./utils/dist");
const { reduce_num } = require("./utils/numred");
const { TowerStats, ElementStats } = require("./stats");
const { Bullet } = require("./objects.js");
const { etToStr, strToEt } = require("./utils/etcast");

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

/* BULLET REQUIRE */

const basicBullet = require("./bullets/basic");
const bombBullet = require("./bullets/bomb");
const splinterBullet = require("./bullets/splinter");
const waterBullet = require("./bullets/water");
const rockBullet = require("./bullets/rock");
const iceBullet = require("./bullets/ice");
const plasmaBullet = require("./bullets/plasma");
const electricityBullet = require("./bullets/electricity");

function update(arenas, delta) { // main game loop
	for (let a of Object.keys(arenas)) {
		const arena = arenas[a];
		if (arena.joinQueue.length > 0) {
			for (let client of arena.joinQueue) {
				arena.addPlayer(client);
				updateArenaLeaderboard(arena);
			}
			arena.joinQueue = [];
		}

		// PLAYERS UPDATE
		let tempqt = new Quadtree({
			width: arena.width,
			height: arena.height,
			maxElements: 5
		})
		for (let p of Object.keys(arena.players)) {
			const player = arena.players[p];
			player.isDamaged = false;
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
				player.energy += 0.007 * delta;
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

				if (player.xv != 0) {
					player.changed["x"] = true;
				}
				if (player.yv != 0) {
					player.changed["y"] = true;
				}
				if (player.bxv != 0) {
					player.changed["x"] = true;
				}
				if (player.byv != 0) {
					player.changed["y"] = true;
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
						if (towerObject.type == "observatory" && towerObject.parentId == player.gameId) {
							if (inObservatory == true) {
								player.changed["fov"] = false;
							} else {
								player.changed["fov"] = true;
							}
							player.effects.observatory = towerObject.effect;
							let angle = Math.atan2(towerObject.y - player.y, towerObject.x - player.x);
							let dist = Math.sqrt(Math.pow(towerObject.x - player.x, 2) + Math.pow(towerObject.y - player.y, 2));
							player.xv += 82 * Math.cos(angle) * delta / 1000 * dist / 50;
							player.yv += 82 * Math.sin(angle) * delta / 1000 * dist / 50;
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
						if (towerObject.parentId === player.gameId) {
							let angle = Math.atan2(player.yv, player.xv);
							player.bxv = Math.cos(angle) * towerObject.effect;
							player.byv = Math.sin(angle) * towerObject.effect;
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

				if (qtPlayer != undefined) {
					qtPlayer.x = player.x - player.size;
					qtPlayer.y = player.y - player.size;
				}

				if (player.effects.observatory > 0) {
					player.fov -= player.effects.observatory;
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

			tower.hp -= tower.decay * delta;

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
				if (bullet.stats.type == "electricity") {
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
				}
			}
			let sendEnergy = player.changed["energy"];
			let sendHealth = player.changed["health"];
			let sendXP = player.changed["xp"];


			const payLoad = {
				t: "u",
				p: playerUpdatePacks,
				tp: towerUpdatePacks,
				bp: bulletUpdatePacks
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