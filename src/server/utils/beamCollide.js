const { dist } = require("./dist");

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
	var l2 = dist2(v, w);
	if (l2 == 0) return dist2(p, v);
	var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	t = Math.max(0, Math.min(1, t));
	return dist2(p, {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y)
	});
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }


function getBeamCollider(arena, bullet){
	let qtsearch = dist(bullet.stats.start.x, bullet.stats.start.y, bullet.stats.end.x, bullet.stats.end.y);
	let collisions = arena.playerqt.colliding({
		x: bullet.stats.start.x - qtsearch,
		y: bullet.stats.start.y - qtsearch,
		width: qtsearch * 2,
		height: qtsearch * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (distToSegment({
			x: element2.x + element2.width/2,
			y: element2.y + element2.width/2
		}, {
			x: bullet.stats.start.x,
			y: bullet.stats.start.y
		}, {
			x: bullet.stats.end.x,
			y: bullet.stats.end.y
		}) < bullet.stats.size + element2.width/2 && bullet.parentId != element2.gameId && arena.players[element2.gameId].spawnProt <= 0)
	});

  let enemyCollisions = arena.enemyqt.colliding({
		x: bullet.stats.start.x - qtsearch,
		y: bullet.stats.start.y - qtsearch,
		width: qtsearch * 2,
		height: qtsearch * 2
	}, function(element1, element2) {
		if(element2.team == bullet.team) return false;
		return (distToSegment({
			x: element2.x + element2.width/2,
			y: element2.y + element2.width/2
		}, {
			x: bullet.stats.start.x,
			y: bullet.stats.start.y
		}, {
			x: bullet.stats.end.x,
			y: bullet.stats.end.y
		}) < bullet.stats.size + element2.width/2)
	});

	let towerCollisions = arena.towerqt.colliding({
		x: bullet.stats.start.x - qtsearch,
		y: bullet.stats.start.y - qtsearch,
		width: qtsearch * 2,
		height: qtsearch * 2
	}, function(element1, element2) {
		if((arena.gamemode == "team" || arena.gamemode == "defense") && element2.team == bullet.team) return false;
		return (distToSegment({
			x: element2.x + element2.width/2,
			y: element2.y + element2.width/2
		}, {
			x: bullet.stats.start.x,
			y: bullet.stats.start.y
		}, {
			x: bullet.stats.end.x,
			y: bullet.stats.end.y
		}) < bullet.stats.size + element2.width/2 && bullet.parentId != element2.parentId)
	});

	collisions = collisions.concat(towerCollisions);
  collisions = collisions.concat(enemyCollisions);

	return collisions;
}

module.exports = getBeamCollider