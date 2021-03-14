const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");

function plasmaBullet(arena, bullet, delta, b) {
  if (bullet.stage == "expanding") {
    bullet.changed["s"] = true;
    bullet.stats.size += bullet.stats.growSpeed * delta;
    bullet.stats.damage += bullet.stats.damageGrow * delta;
    if (bullet.tower.changed["d"] == true) {
      bullet.x = bullet.tower.x + (Math.cos(bullet.tower.dir) * 70);
      bullet.y = bullet.tower.y + (Math.sin(bullet.tower.dir) * 70);
      bullet.changed["x"] = true;
      bullet.changed["y"] = true;
    }
    if (bullet.stats.size >= bullet.stats.maxSize) {
      bullet.stats.size = bullet.stats.maxSize;
      bullet.stage = "normal";
      bullet.xv = Math.cos(bullet.tower.dir) * bullet.stats.speed;
      bullet.yv = Math.sin(bullet.tower.dir) * bullet.stats.speed;
    }
    let collides = getBulletCollider(arena, bullet);
    for (let collider of collides) {
      if (collider.gameId != undefined) {
        arena.players[collider.gameId].hp -= bullet.stats.damage * delta / 37;
        arena.players[collider.gameId].isDamaged = true;
        if (arena.players[collider.gameId].hp <= 0) {
          // collider died
          arena.players[collider.gameId].die(arena, arena.players[bullet.parentId]);
          let deleteQtPlayer = arena.playerqt.find(function(element) {
            return element.gameId === collider.gameId
          })
          if (deleteQtPlayer.length > 0) {
            arena.playerqt.remove(deleteQtPlayer[0]);
          }
        }
      } else if (collider.team == -1) {
        if (arena.enemies[collider.id] != undefined) {
          arena.enemies[collider.id].hp -= bullet.stats.damage * delta / 37;
          arena.enemies[collider.id].changed["hp"] = true;
          if (arena.enemies[collider.id].hp <= 0) {
            arena.enemies[collider.id].die(arena, bullet.parentId);
          }
        }
      } else {
        if (arena.towers[collider.id] != undefined) {
          arena.towers[collider.id].hp -= bullet.stats.damage * delta / 37;
        }
      }
    }
  } else if (bullet.stage == "normal") {
    bullet.x += bullet.xv * delta;
    bullet.y += bullet.yv * delta;
    bullet.changed["x"] = true;
    bullet.changed["y"] = true;
    bullet.stats.hp -= bullet.stats.decay * delta;
    let collides = getBulletCollider(arena, bullet);
    for (let collider of collides) {
      if (collider.gameId != undefined) {
        arena.players[collider.gameId].hp -= bullet.stats.damage * delta / 37;
        arena.players[collider.gameId].isDamaged = true;
        if (arena.players[collider.gameId].hp <= 0) {
          // collider died
          arena.players[collider.gameId].die(arena, arena.players[bullet.parentId]);
          let deleteQtPlayer = arena.playerqt.find(function(element) {
            return element.gameId === collider.gameId
          })
          if (deleteQtPlayer.length > 0) {
            arena.playerqt.remove(deleteQtPlayer[0]);
          }
        }
      } else if (collider.team == -1) {
        if (arena.enemies[collider.id] != undefined) {
          arena.enemies[collider.id].hp -= bullet.stats.damage * delta / 37;
          arena.enemies[collider.id].changed["hp"] = true;
        }
      } else {
        if (arena.towers[collider.id] != undefined) {
          arena.towers[collider.id].hp -= bullet.stats.damage * delta / 37;
        }
      }
    }

    if (bullet.x < bullet.stats.size || bullet.x > arena.width - bullet.stats.size || bullet.y < bullet.stats.size || bullet.y > arena.height - bullet.stats.size) {
      // hits wall
      bullet.stats.hp = 0;
    }

    if (bullet.stats.hp <= 0) {
      //Send Packet to Everyone
      for (let player of bullet.seenBy) {
        const payLoad = {
          t: "rb",
          i: bullet.id,
          x: bullet.x,
          y: bullet.y
        }
        player.ws.send(msgpack.encode(payLoad));
      }
      delete arena.bullets[b];
    }
  }

}

module.exports = plasmaBullet;