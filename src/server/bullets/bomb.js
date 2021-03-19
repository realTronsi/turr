const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");

function bombBullet(arena, bullet, delta, b) {
  if (bullet.stage == "normal") {
    bullet.x += bullet.xv * delta;
    bullet.y += bullet.yv * delta;
    bullet.changed["x"] = true;
    bullet.changed["y"] = true;
    bullet.stats.hp -= bullet.stats.decay * delta;
    let collides = getBulletCollider(arena, bullet);
    if (collides.length > 0) {
      // collided with something
      bullet.stage = "exploding";
    }
    if (bullet.x < bullet.stats.size || bullet.x > arena.width - bullet.stats.size || bullet.y < bullet.stats.size || bullet.y > arena.height - bullet.stats.size) {
      // hits wall
      bullet.stats.hp = 0;
    }
    if (bullet.stats.hp <= 0) {
      bullet.stage = "exploding";
    }
  } else if (bullet.stage == "exploding") {
    bullet.changed["s"] = true;
    bullet.stats.size += bullet.stats.explodeSpeed * delta;
    let collides = getBulletCollider(arena, bullet);
    for (let collider of collides) {
      if (collider.gameId != undefined) {
        arena.players[collider.gameId].hp -= bullet.stats.damage * delta / 37;
        arena.players[collider.gameId].isDamaged = true;
        if (arena.players[collider.gameId].hp <= 0) {
          // collider died
          arena.players[collider.gameId].die(arena, bullet.parentId);
          let deleteQtPlayer = arena.playerqt.find(function(element) {
            return element.gameId === collider.gameId
          })
          if (deleteQtPlayer.length > 0) {
            arena.playerqt.remove(deleteQtPlayer[0]);
          }
        }
      } else if (collider.team == -1) {
        if (arena.enemies[collider.id] != undefined) {
          const enemy = arena.enemies[collider.id]
          enemy.hp -= bullet.stats.damage * delta / 37;
          enemy.changed["hp"] = true;
          if (enemy.hp <= 0) {
            enemy.die(arena, bullet.parentId);
          }
        }
      } else {
        if (arena.towers[collider.id] != undefined) {
          arena.towers[collider.id].hp -= bullet.stats.damage * delta / 37;
        }
      }
    }
    if (bullet.stats.size >= bullet.stats.explodeRadius) {
      // explosion done
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

module.exports = bombBullet;