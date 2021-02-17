const Tiers = [3000, 15000, 50000, 150000, 1e69];

const ElementStats = {
  basic: {
    speed: 13,
    attack: 1,
    defense: 100,
    friction: 0.5,
    fov: 1,
    maxEnergy: 100,
    towers: ["farm", "basic", "heal"],
    upgrades: ["fire", "water", "earth"]
  },
  fire: {
    speed: 12,
    attack: 1.2,
    defense: 85,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel"],
    maxEnergy: 100,
  },
  water: {
    speed: 11,
    attack: 1.05,
    defense: 105,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal"],
    maxEnergy: 100,
  },
  earth: {
    speed: 10,
    attack: 0.8,
    defense: 175,
    friction: 0.5,
    fov: 0.8,
    towers: ["farm", "basic", "heal"],
    maxEnergy: 100,
  }

}
const TowerStats = {
  farm: {
    hp: 120,
    energy: 30,
		decay: 8,
    size: 40,
		effect: 1000/1000 //23/1000
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
		effect: 4/1000,
		radius: 250
  },
  bomb: {
    hp: 190,
    energy: 60,
    decay: 8,
    reload: 1000,
    range: 700,
    size: 40,
    bullet: {
      type: "bomb",
			damage: 8.3333,
			size: 32,
			speed: 480,
      hp: 12,
      decay: 8,
			explodeRadius: 150,
			explodeSpeed: 350/1000
    }
  },
  propel: {
    hp: 120,
    energy: 35,
		decay: 8,
    size: 40,
		effect: 60,
    collide: false
  }
  /*
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