const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");

function waterBullet(arena, bullet, delta, b) {
  bullet.x += bullet.xv * delta;
  bullet.y += bullet.yv * delta;
  bullet.changed["x"] = true;
  bullet.changed["y"] = true;
  bullet.stats.damage -= bullet.stats.damageDecay * delta;
  bullet.stats.size -= bullet.stats.sizeDecay * delta;
  if (bullet.stats.size < 0) {
    bullet.stats.size = 0;
  }

  bullet.changed["s"] = true;


  let collides = getBulletCollider(arena, bullet);
  for (let collider of collides) {
    bullet.stats.hp -= 20 * delta / 37;
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

  if (bullet.x < bullet.stats.size || bullet.x > arena.width - bullet.stats.size || bullet.y < bullet.stats.size || bullet.y > arena.height - bullet.stats.size) {
    // hits wall
    bullet.stats.size = 0;
  }

  if (bullet.stats.size <= 1) {
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

module.exports = waterBullet;