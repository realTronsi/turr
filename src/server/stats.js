const Tiers = [3000, 15000, 50000, 150000, 1e69];

const ElementStats = {
  basic: {
    speed: 13.5,
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
    attack: 1.25,
    defense: 80,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel"],
		upgrades: ["magma", "plasma"],
    maxEnergy: 100
  },
  water: {
    speed: 11,
    attack: 1.05,
    defense: 110,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "streamer", "drown"],
		upgrades: ["ice", "electricity"],
    maxEnergy: 100
  },
  earth: {
    speed: 10,
    attack: 0.8,
    defense: 140,
    friction: 0.5,
    fov: 0.9,
    towers: ["farm", "basic", "heal", "splinter", "observatory"],
    upgrades: ["rock"],
    maxEnergy: 100
  },
	magma: {
		speed: 11.5,
    attack: 1.1,
    defense: 95,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel", "volcano"],
		upgrades: [],
    maxEnergy: 100
	},
	plasma: {
		speed: 10.5,
    attack: 1.35,
    defense: 85,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel", "ionizer"],
		upgrades: [],
    maxEnergy: 100
	},
  rock: {
    speed: 9.5,
    attack: 0.9,
    defense: 145,
    friction: 0.5,
    fov: 0.9,
    towers: ["farm", "basic", "heal", "splinter", "observatory", "slingshot"],
    maxEnergy: 100
  },
	ice: {
		speed: 1.2,
    attack: 1.1,
    defense: 100,
    friction: 0.9,
    fov: 0.95,
    towers: ["farm", "basic", "heal", "streamer", "drown", "ice gunner"],
    maxEnergy: 100
	},
  electricity: {
    speed: 12,
    attack: 1.15,
    defense: 97,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "streamer", "drown"],
		upgrades: [],
    maxEnergy: 100
  },
  
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
			damage: 22,
			size: 12,
			speed: 700,
      hp: 15,
      decay: 12
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
    energy: 65,
    decay: 8,
    reload: 1400,
    range: 700,
    size: 40,
    bullet: {
      type: "bomb",
			damage: 8,
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
  },
  streamer: {
    hp: 260,
    energy: 60,
    decay: 8,
    reload: 190,
    range: 690,
    size: 40,
    bullet: {
      type: "water",
			damage: 6,
			size: 15,
			speed: 650,
      hp: 1,
      decay: 0,
			sizeDecay: 15/1200,
			damageDecay: 6/1200
    }
  },
  drown: {
    hp: 240,
    energy: 25,
		decay: 24,
    size: 40,
		effect: 40,
		radius: 200
  },
  splinter: {
    hp: 240,
    energy: 40,
    decay: 8,
    reload: 1100,
    range: 900,
    size: 40,
    bullet: {
      type: "splinter",
			damage: 8.5,
			size: 20,
			speed: 520,
      hp: 2,
      decay: 2.5,
			expandAmount: 25/1000,
			bullet: {
				type: "basic",
				hp: 5,
				decay: 8,
				damage: 18,
				size: 13,
				speed: 700
			}
    }
  },
  observatory: {
    hp: 350,
    energy: 70,
    decay: 8,
    size: 60,
    effect: 0.35
  },
  volcano: {
    hp: 1500,
    decay: 600,
    energy: 65,
    size: 60,
		explosionTimer: 1000,
		state: "normal",
		bullet: {
      type: "bomb",
			damage: 8,
			size: 60,
			speed: 0,
      hp: 1,
      decay: 100,
			explodeRadius: 450,
			explodeSpeed: 900/1000
    },
		bullet2: {
			type: "bomb",
			damage: 6,
			size: 28,
			speed: 250,
      hp: 2,
      decay: 1,
			explodeRadius: 220,
			explodeSpeed: 420/1000
		},
		bullet3: {
			type: "rock",
			damage: 60,
			size: 18,
			speed: 950,
      hp: 10,
      decay: 7
		}
  },
  slingshot: {
    hp: 250,
    energy: 45,
		decay: 8,
    size: 50,
		reload: 1700,
		range: 900,
    bullet: {
      type: "rock",
			damage: 50,
			size: 30,
			speed: 1200,
      hp: 15,
      decay: 12
    }
  },
  "ice gunner": {
		hp: 250,
    energy: 45,
		decay: 8,
    size: 40,
		reload: 400,
		range: 550,
    bullet: {
      type: "ice",
			damage: 3,
			size: 11,
			speed: 650,
      hp: 15,
      decay: 12,
      effect: 0.25
    }
	},
  ionizer: {
    hp: 360,
    energy: 55,
		decay: 8,
    size: 40,
		reload: 1900,
		range: 800,
    bullet: {
      type: "plasma",
			damage: 14,
			size: 6,
			speed: 850,
      hp: 3,
      decay: 1,
			growSpeed: 15/1000,
			damageGrow: 8/1000,
			maxSize: 25
    }
  }
}
module.exports = {TowerStats, ElementStats }