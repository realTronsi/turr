/*export function lbUpdate(gameData){
  let leaderboard = [];
  let players = JSON.parse(JSON.stringify(gameData.players));
  players[gameData.you.id] = JSON.parse(JSON.stringify(gameData.you));
	for (let i of Object.keys(players)) {
		const player = players[i];
		let type = "normal";
		if (player.id === gameData.you.id) {
			type = "self";
		}
		leaderboard.push({
			name: player.shortName,
			xp: player.xp,
			type: type,
			id: player.id
		})
	}

  leaderboard.sort((a, b) => b.xp - a.xp);
	let place = 0;
	for (let i of leaderboard) {
		place++;
	  players[i.id].place = place;
		i.place = place;
	}
	leaderboard = leaderboard.slice(0, 3);
	if (!leaderboard.find((e) => e.id === gameData.you.id)) {
		leaderboard.push({
      name: gameData.you.shortName,
      xp: gameData.you.xp,
      type: "youBad",
      id: gameData.you.id,
      place: players[gameData.you.id].place
    })
  }
  return leaderboard;
}*/