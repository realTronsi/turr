const DefenseTowerStats = {
	farm: {
  },
  basic: {
  },
  heal: {
  },
  bomb: {
  },
  propel: {
  },
  streamer: {
  },
  drown: {
  },
  splinter: {
  },
  observatory: {
  },
  slingshot: {
  },
  cannon: {
    hp: 360,
    range: 700,
    bullets:{
    bullet1: {
      type: "cannonball",
      damage: 40,
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
	},
  ionizer: {
	},
	"tesla coil": {
	},
  toxicator: {
  },
	blower: {
	},
  volcano: {
    hp: 900,
    decay: 300,
    bullets: {
		bullet1: {
      type: "bomb",
			damage: 3.8,
			size: 60,
			speed: 0,
      hp: 1,
      decay: 100,
			explodeRadius: 450,
			explodeSpeed: 800/1000
    },
		bullet2: {
			type: "bomb",
			damage: 2.2,
			size: 28,
			speed: 250,
      hp: 2,
      decay: 1,
			explodeRadius: 180,
			explodeSpeed: 400/1000
		},
		bullet3: {
			type: "rock",
			damage: 30,
			size: 18,
			speed: 950,
      hp: 10,
      decay: 7
		},
    bullet4: {
			type: "basic",
			damage: 35,
			size: 22,
			speed: 600,
      hp: 10,
      decay: 7
		}
    }

  },
	laser: {
		hp: 120,
		spinSpeed: 4/1000,
		bullets: {
      bullet1: {
			type: "beam",
			damage: 1.5,
			size: 10, // width
			start: {},
			end: {}
      }
		}
	},
  base: {}
}
module.exports = { DefenseTowerStats }