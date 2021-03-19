const Tiers = [3000, 15000, 50000, 150000, Infinity];

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
    fov: 1.1,
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
    effect: 23 / 1000
  },
  basic: {
    hp: 140,
    energy: 35,
    decay: 7,
    size: 40,
    reload: 700,
    range: 750,
    bullets: {
      bullet1: {
        type: "basic",
        damage: 17,
        size: 12,
        speed: 650,
        hp: 15,
        decay: 12
      }
    }
  },
  heal: {
    hp: 200,
    energy: 30,
    decay: 7,
    size: 40,
    effect: 3 / 1000,
    radius: 250
  },
  bomb: {
    hp: 170,
    energy: 55,
    decay: 7,
    reload: 1400,
    range: 700,
    size: 40,
    bullets: {
      bullet1: {
        type: "bomb",
        damage: 4,
        size: 32,
        speed: 450,
        hp: 12,
        decay: 8,
        explodeRadius: 160,
        explodeSpeed: 360 / 1000
      }
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
    bullets: {
      bullet1: {
        type: "water",
        damage: 5,
        size: 15,
        speed: 630,
        hp: 1,
        decay: 0,
        sizeDecay: 15 / 1200,
        damageDecay: 5 / 1200
      }
    }
  },
  drown: {
    hp: 80,
    energy: 25,
    decay: 7,
    size: 40,
    effect: 50,
    radius: 200
  },
  splinter: {
    hp: 240,
    energy: 40,
    decay: 7,
    reload: 1100,
    range: 900,
    size: 40,
    bullets: {
      bullet1: {
        type: "splinter",
        damage: 5,
        size: 20,
        speed: 500,
        hp: 2,
        decay: 2.5,
        expandAmount: 25 / 1000,
        bullet: {
          type: "basic",
          hp: 5,
          decay: 8,
          damage: 12,
          size: 12,
          speed: 700
        }
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
    energy: 50,
    size: 60,
    explosionTimer: 200,
    state: "normal",
    bullets: {
    bullet1: {
      type: "bomb",
      damage: 8,
      size: 60,
      speed: 0,
      hp: 1,
      decay: 100,
      explodeRadius: 450,
      explodeSpeed: 800 / 1000
    },
    bullet2: {
      type: "bomb",
      damage: 5,
      size: 28,
      speed: 250,
      hp: 2,
      decay: 1,
      explodeRadius: 180,
      explodeSpeed: 400 / 1000
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
    }

  },
  slingshot: {
    hp: 260,
    energy: 40,
    decay: 7,
    size: 50,
    reload: 1500,
    range: 900,
    bullets:{
    bullet1: {
      type: "rock",
      damage: 55,
      size: 30,
      speed: 1200,
      hp: 15,
      decay: 12
    }
    }
  },
  cannon: {
    hp: 320,
    energy: 55,
    decay: 7,
    size: 45,
    reload: 1700,
    range: 650,
    bullets:{
    bullet1: {
      type: "cannonball",
      damage: 23,
      size: 20,
      speed: 1050,
      hp: 15,
      decay: 12,
      multiplier: 4,
      knockback: 28
    }
    }
  },
  "ice gunner": {
    hp: 250,
    energy: 45,
    decay: 7,
    size: 40,
    reload: 350,
    range: 550,
    bullets:{ 
    bullet1: {
      type: "ice",
      damage: 6,
      size: 11,
      speed: 650,
      hp: 15,
      decay: 12,
      effect: 0.25
    }
    }
  },
  ionizer: {
    hp: 260,
    energy: 50,
    decay: 7,
    size: 40,
    reload: 2100,
    range: 800,
    bullets:{
    bullet1: {
      type: "plasma",
      damage: 8,
      size: 6,
      speed: 750,
      hp: 1.3,
      decay: 1,
      growSpeed: 15 / 1000,
      damageGrow: 4 / 1000,
      maxSize: 25
    }
    }
  },
  "tesla coil": {
    hp: 150,
    energy: 40,
    decay: 7,
    size: 40,
    reload: 2000,
    range: 300,
    bullets:{
    bullet1: {
      type: "electricity",
      damage: 20,
      size: 0,
      nodes: [],
      chainSpeed: 180,
      chainDistance: 300,
      maxChain: 5,
      timer: 180
    }
    }
  },
  laser: {
    hp: 80,
    energy: 55,
    decay: 2,
    size: 40,
    range: 500,
    spinSpeed: 1.8 / 1000,
    beam: null, // beam itself, only one bullet at a time
    bullets:{
    bullet1: {
      type: "beam",
      damage: 0.6,
      size: 10, // width
      start: {},
      end: {}
    }
    }
  },
  toxicator: {
    hp: 300,
    energy: 30,
    decay: 7,
    size: 30,
    range: 700,
    reload: 1000,
    bullets:{
    bullet1: {
      type: "poison",
      hp: 5,
      decay: 8,
      speed: 800,
      damage: 0,
      size: 18,
      effect: 4.5,
      duration: 5000
    }
    }
  },
  blower: {
    hp: 150,
    energy: 20,
    decay: 7,
    size: 60,
    range: 700,
    reload: 1000,
    bullets:{
    bullet1: {
      type: "air",
      damage: 0,
      size: 20,
      speed: 650,
      hp: 1.5,
      decay: 1.2,
      knockback: 3
    }
    }
  },
  base: {
    hp: 3000,
    energy: Infinity,
    decay: -200,
    size: 400
  }
}

const EnemyStats = {
  soldier: {
    hp: 80,
    damage: 30,
    size: 30,
    speed: 90 / 1000,
    range: 500,
    reward: 600
  },
  ninja: {
    hp: 50,
    damage: 30,
    size: 25,
    speed: 140 / 1000,
    range: 500,
    reward: 600
  },
  strong: {
    hp: 160,
    damage: 40,
    size: 35,
    speed: 60 / 1000,
    range: 500,
    reward: 700
  },
  tank: {
    hp: 120,
    damage: 10,
    size: 40,
    speed: 40 / 1000,
    range: 500,
    shootRange: 800,
    reward: 1000,
    reload: 800,
    bullet: {
      type: "basic",
      damage: 24,
      size: 14,
      speed: 650,
      hp: 15,
      decay: 12
    }
  },
	"machine gunner": {
		hp: 120,
    damage: 10,
    size: 40,
    speed: 40 / 1000,
    range: 500,
    shootRange: 800,
    reward: 1000,
    reload: 300,
    bullet: {
      type: "cannonball",
      damage: 5,
      size: 14,
      speed: 650,
      hp: 15,
      decay: 12,
      multiplier: 1,
      knockback: 2
    }
	},
  tadpole: {
    hp: 130,
    damage: 40,
    size: 25,
    speed: 40 / 1000,
    range: 700,
    shootRange: 800,
    reward: 1500,
    reload: 370,
    reload2: 1400,
    reloadoffset2: 1200,
    bullet: {
      type: "water",
      damage: 3,
      size: 18,
      speed: 630,
      hp: 1,
      decay: 0,
      sizeDecay: 18 / 1200,
      damageDecay: 3 / 1200
    },
    bullet2: {
      type: "basic",
      damage: 12,
      size: 12,
      speed: 550,
      hp: 16,
      decay: 33
    }
  },
  frog: {
    hp: 240,
    damage: 60,
    size: 45,
    speed: 30 / 1000,
    range: 750,
    shootRange: 850,
    reward: 2500,
    reload: 330,
    reload2: 1600,
    reloadoffset2: 1200,
    bullet: {
      type: "water",
      damage: 4,
      size: 30,
      speed: 630,
      hp: 1,
      decay: 0,
      sizeDecay: 30 / 1200,
      damageDecay: 4 / 1200
    },
    bullet2: {
      type: "basic",
      damage: 18,
      size: 12,
      speed: 550,
      hp: 16,
      decay: 33
    },
    bullet3: {
      type: "poison",
      hp: 5,
      decay: 8,
      speed: 800,
      damage: 0,
      size: 18,
      effect: 4.5,
      duration: 5000
    }
  },
  

}
module.exports = { TowerStats, ElementStats, EnemyStats }