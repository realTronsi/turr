const getBulletCollider = require(".././utils/bulletCollide");
const msgpack = require("msgpack-lite");
const { Bullet } = require(".././objects.js");

function splinterBullet(arena, bullet, delta, b) {
  bullet.x += bullet.xv * delta;
  bullet.y += bullet.yv * delta;
  bullet.changed["x"] = true;
  bullet.changed["y"] = true;
  bullet.stats.hp -= bullet.stats.decay * delta;
  bullet.stats.size += bullet.stats.expandAmount * delta;
  bullet.changed["s"] = true;

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
      bullet.stats.hp = 0; // hit non player
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

    let id = arena.createBulletId();
    let dir = Math.atan2(bullet.yv, bullet.xv);

    arena.bullets[id] = new Bullet(id, bullet.x, bullet.y, dir, bullet.stats.bullet, bullet.tower);
    id = arena.createBulletId();
    arena.bullets[id] = new Bullet(id, bullet.x, bullet.y, dir + 0.52, bullet.stats.bullet, bullet.tower);
    id = arena.createBulletId();
    arena.bullets[id] = new Bullet(id, bullet.x, bullet.y, dir - 0.52, bullet.stats.bullet, bullet.tower);
		/*
		new Bullet(bulletId, tower.parentId, tower.parentStats, tower.x, tower.y, tower.dir, TowerStats[tower.type].bullet)
		*/
  }
}

module.exports = splinterBullet;