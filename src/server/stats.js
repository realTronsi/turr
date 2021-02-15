const ElementStats = {
  basic: {
    speed: 13,
    attack: 1,
    defense: 100,
    friction: 0.5,
    fov: 1,
    maxEnergy: 100
  },
  fire: {
    speed: 1.2,
    attack: 1.2,
    defense: 80,
    fov: 1.2,
    maxEnergy: 100
  },
  water: {
    speed: 1.1,
    attack: 0.95,
    defense: 105,
    fov: 1,
    maxEnergy: 100
  },
  earth: {
    speed: 0.75,
    attack: 0.8,
    defense: 180,
    fov: 0.85,
    maxEnergy: 100
  }

}
const TowerStats = {
  farm: {
    hp: 120,
    energy: 30,
		decay: 8,
    size: 40,
		effect: 23/1000
  },
  basic: {
    hp: 150,
    energy: 35,
		decay: 8,
    size: 40,
		reload: 500,
		range: 750,
    bullet: {
      type: "basic",
			damage: 20,
			size: 12,
			speed: 700,
      hp: 30,
      decay: 24
    }
  },
  heal: {
    hp: 240,
    energy: 40,
		decay: 8,
    size: 40,
		effect: 3/1000,
		radius: 250
  },
  /*
  bomb: {
    hp: 160,
    energy: 70,
		decay: 6
  },
  streamer: {
    hp: 210,
    energy: 50,
		decay: 6
  },
  splinter: {
    hp: 170,
    energy: 50,
		decay: 6
  },
  core: {
    hp: 240,
    energy: 50,
		decay: 6
  },
  barrier: {
    hp: 400,
    energy: 50,
    decay: 10
  },
  sandpit: {
    hp: 40,
    energy: 50,
    decay: 4
  }
  */
}
module.exports = {TowerStats, ElementStats }