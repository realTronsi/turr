const Tiers = [3000, 15000, 50000, 150000, Infinity];

/*
Everyone speed nerf
Metal + 33% attack - 9% defense nerf
Plasma Bullet life span 50%
Basic Tower Reload time +30%
everything damage and bullet speed nerfed
decay decreased
*/

const ElementStats = {
  basic: {
    speed: 12.5,
    attack: 1,
    defense: 100,
    friction: 0.5,
    fov: 1,
    maxEnergy: 100,
    towers: ["farm", "basic", "heal"],
    upgrades: ["fire", "water", "earth"]
  },
  fire: {
    speed: 11,
    attack: 1.25,
    defense: 80,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel"],
		upgrades: ["magma", "plasma", "light"],
    maxEnergy: 100
  },
  water: {
    speed: 10,
    attack: 1.05,
    defense: 110,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "streamer", "drown"],
		upgrades: ["ice", "electricity", "air"],
    maxEnergy: 100
  },
  earth: {
    speed: 9,
    attack: 0.8,
    defense: 140,
    friction: 0.5,
    fov: 0.9,
    towers: ["farm", "basic", "heal", "splinter", "observatory"],
    upgrades: ["rock", "metal", "toxin"],
    maxEnergy: 100
  },
	magma: {
		speed: 10.5,
    attack: 1.1,
    defense: 95,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel", "volcano"],
		upgrades: [],
    maxEnergy: 100
	},
	plasma: {
		speed: 9.5,
    attack: 1.35,
    defense: 85,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "bomb", "propel", "ionizer"],
		upgrades: [],
    maxEnergy: 100
	},
  rock: {
    speed: 8.5,
    attack: 0.85,
    defense: 145,
    friction: 0.5,
    fov: 0.85,
    towers: ["farm", "basic", "heal", "splinter", "observatory", "slingshot"],
    maxEnergy: 100
  },
	ice: {
		speed: 1.1,
    attack: 1.1,
    defense: 100,
    friction: 0.9,
    fov: 0.95,
    towers: ["farm", "basic", "heal", "streamer", "drown", "ice gunner"],
    maxEnergy: 100
	},
  electricity: {
    speed: 11,
    attack: 1.15,
    defense: 97,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "streamer", "drown", "tesla coil"],
		upgrades: [],
    maxEnergy: 100
  },
  metal: {
    speed: 7.5,
    attack: 1,
    defense: 160,
    friction: 0.5,
    fov: 0.95,
    towers: ["farm", "basic", "heal", "splinter", "observatory", "cannon"],
    maxEnergy: 100
  },
	light: {
		speed: 11.5,
		attack: 1.25,
		defense: 90,
    friction: 0.5,
		fov: 1.2,
		towers: ["farm", "basic", "heal", "bomb", "propel", "laser"],
		maxEnergy: 110
	},
  toxin: {
    speed: 9.5,
    attack: 1.1,
    defense: 120,
    friction: 0.5,
    fov: 1,
    towers: ["farm", "basic", "heal", "splinter", "observatory", "toxicator"],
    upgrades: [],
    maxEnergy: 100
  },
  air: {
    speed: 11.5,
    attack: 0.95,
    defense: 95,
    friction: 0.5,
    fov: 0.85,
    towers: ["farm", "basic", "heal", "streamer", "drown", "blower"],
		upgrades: [],
    maxEnergy: 100
  },
}
const TowerStats = {
  farm: {
    hp: 120,
    energy: 30,
		decay: 7,
    size: 40,
		effect: 23/1000
  },
  basic: {
    hp: 140,
    energy: 35,
		decay: 7,
    size: 40,
		reload: 700,
		range: 750,
    bullet: {
      type: "basic",
			damage: 17,
			size: 12,
			speed: 650,
      hp: 15,
      decay: 12
    }
  },
  heal: {
    hp: 200,
    energy: 30,
		decay: 7,
    size: 40,
		effect: 3/1000,
		radius: 250
  },
  bomb: {
    hp: 170,
    energy: 55,
    decay: 7,
    reload: 1400,
    range: 700,
    size: 40,
    bullet: {
      type: "bomb",
			damage: 4,
			size: 32,
			speed: 450,
      hp: 12,
      decay: 8,
			explodeRadius: 160,
			explodeSpeed: 360/1000
    }
  },
  propel: {
    hp: 120,
    energy: 25,
		decay: 7,
    size: 40,
		effect: 50,
    collide: false
  },
  streamer: {
    hp: 200,
    energy: 40,
    decay: 7,
    reload: 180,
    range: 690,
    size: 40,
    bullet: {
      type: "water",
			damage: 5,
			size: 15,
			speed: 630,
      hp: 1,
      decay: 0,
			sizeDecay: 15/1200,
			damageDecay: 5/1200
    }
  },
  drown: {
    hp: 80,
    energy: 25,
		decay: 7,
    size: 40,
		effect: 30,
		radius: 200
  },
  splinter: {
    hp: 240,
    energy: 40,
    decay: 7,
    reload: 1100,
    range: 900,
    size: 40,
    bullet: {
      type: "splinter",
			damage: 5,
			size: 20,
			speed: 500,
      hp: 2,
      decay: 2.5,
			expandAmount: 25/1000,
			bullet: {
				type: "basic",
				hp: 5,
				decay: 8,
				damage: 12,
				size: 12,
				speed: 700
			}
    }
  },
  observatory: {
    hp: 350,
    energy: 60,
    decay: 7,
    size: 60,
    effect: 0.66
  },
  volcano: {
    hp: 300,
    decay: 100,
    energy: 65,
    size: 60,
		explosionTimer: 200,
		state: "normal",
		bullet: {
      type: "bomb",
			damage: 8,
			size: 60,
			speed: 0,
      hp: 1,
      decay: 100,
			explodeRadius: 450,
			explodeSpeed: 800/1000
    },
		bullet2: {
			type: "bomb",
			damage: 5,
			size: 28,
			speed: 250,
      hp: 2,
      decay: 1,
			explodeRadius: 180,
			explodeSpeed: 400/1000
		},
		bullet3: {
			type: "rock",
			damage: 60,
			size: 18,
			speed: 950,
      hp: 10,
      decay: 7
		},
    bullet4: {
			type: "basic",
			damage: 70,
			size: 22,
			speed: 600,
      hp: 10,
      decay: 7
		}

  },
  slingshot: {
    hp: 180,
    energy: 45,
		decay: 7,
    size: 50,
		reload: 1700,
		range: 900,
    bullet: {
      type: "rock",
			damage: 40,
			size: 30,
			speed: 1150,
      hp: 15,
      decay: 12
    }
  },
  cannon: {
    hp: 300,
    energy: 55,
		decay: 7,
    size: 45,
		reload: 1700,
		range: 650,
    bullet: {
      type: "cannonball",
			damage: 22,
			size: 20,
			speed: 1050,
      hp: 15,
      decay: 12,
      multiplier: 5,
      knockback: 28
    }
  },
  "ice gunner": {
		hp: 250,
    energy: 45,
		decay: 7,
    size: 40,
		reload: 400,
		range: 550,
    bullet: {
      type: "ice",
			damage: 7,
			size: 11,
			speed: 650,
      hp: 15,
      decay: 12,
      effect: 0.25
    }
	},
  ionizer: {
    hp: 260,
    energy: 50,
		decay: 7,
    size: 40,
		reload: 2100,
		range: 800,
    bullet: {
      type: "plasma",
			damage: 8,
			size: 6,
			speed: 750,
      hp: 1.3,
      decay: 1,
			growSpeed: 15/1000,
			damageGrow: 4/1000,
			maxSize: 25
    }
	},
	"tesla coil": {
		hp: 150,
    energy: 45,
		decay: 7,
    size: 40,
		reload: 1900,
		range: 300,
    bullet: {
      type: "electricity",
			damage: 20,
			size: 0,
			nodes: [],
			chainSpeed: 150,
			chainDistance: 300,
			maxChain: 5,
			timer: 150
    }
	},
	laser: {
		hp: 80,
		energy: 55,
		decay: 2,
		size: 40,
		range: 500,
		spinSpeed: 1.8/1000,
		beam: null, // beam itself, only one bullet at a time
		bullet: {
			type: "beam",
			damage: 0.6,
			size: 10, // width
			start: {},
			end: {}
		}
	},
  toxicator: {
    hp: 300,
    energy: 30,
    decay: 7, 
    size: 30, 
    range: 700,
    reload: 1000,
    bullet: {
      type: "poison",
      hp: 5,
      decay: 8,
      speed: 800,
      damage: 0, 
      size: 18,
      effect: 5,
      duration: 5000
    }
  },
	blower: {
		hp: 150,
		energy: 20,
		decay: 7,
		size: 60,
		range: 700,
    reload: 1000,
		bullet: {
			type: "air",
			damage: 0,
			size: 20,
			speed: 650,
      hp: 1.5,
      decay: 1.2,
      knockback: 3
		}
	}
}
module.exports = {TowerStats, ElementStats }