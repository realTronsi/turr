function spawnPoint(arena){

	let xweights = [];
	let yweights = [];
	xweights.push(0 + Math.random() * arena.width/20);
	xweights.push(0 + Math.random() * arena.width/20);
	xweights.push(arena.width - Math.random() * arena.width/20);
	xweights.push(arena.width - Math.random() * arena.width/20);
	yweights.push(0 + Math.random() * arena.height/20);
	yweights.push(0 + Math.random() * arena.height/20);
	yweights.push(arena.height - Math.random() * arena.height/20);
	yweights.push(arena.height - Math.random() * arena.height/20);

	for(let p of Object.keys(arena.players)){
		const player = arena.players[p];
		xweights.push(
			-1*(player.x - arena.width/2)*(Math.sqrt((1/(Math.abs(player.x - arena.width/2)/arena.width/2))))
		);
		yweights.push(
			-1*(player.y - arena.height/2)*(Math.sqrt((1/(Math.abs(player.y - arena.height/2)/arena.height/2))))
		);
	}

	let l = xweights.length;
	let xa = ((xweights.reduce((a, b)=>a+b))/l)+Math.random()*arena.width/10*rapo();
	let ya = ((yweights.reduce((a, b)=>a+b))/l)+Math.random()*arena.width/10*rapo();


  return {x: xa, y: ya}
}

function rapo(){
	if(Math.random()>0.5) return 1;
	return -1;
}

module.exports = { spawnPoint }