export const ElementTiers = {
  basic: {
    tier: 1,
    upgrades: [
      {color: "#f72828", name: "fire"},
      {color: "#2889de", name: "water"},
      {color: "#27b039", name: "earth"}
    ],
    towers: ["farm", "basic", "heal"],
    maxHP: 100,
    maxEnergy: 100,
    speed: 12.5,
    attack: 1,
    fov: 1
  },
  fire: {
    tier: 2,
    upgrades: [
      {color: "#a12020", name: "magma"},
      {color: "#dc4fe3", name: "plasma"},
      {color: "#e3e3c1", name: "light"}
    ],
    towers: ["farm", "basic", "heal", "bomb", "propel"],
    maxHP: 80,
    maxEnergy: 100,
    speed: 11,
    attack: 1.25,
    fov: 1
  },
  water: {
    tier: 2,
    upgrades: [
      {color: "#4ec4cc", name: "ice"},
      {color: "#bdbd44", name: "electricity"},
      {color: "#888888", name: "air"},
    ],
    towers: ["farm", "basic", "heal", "streamer", "drown"],
    fov: 1,
    maxHP: 110,
    maxEnergy: 100,
    speed: 10,
    attack: 1.05
  },
  earth: {
    tier: 2,
    upgrades: [
      {color: "#632305", name: "rock"},
      {color: "#43464b", name: "metal"},
      {color: "#20d64b", name: "toxin"}
    ],
    towers: ["farm", "basic", "heal", "splinter", "observatory"],
    fov: 0.9,
    maxHP: 140,
    maxEnergy: 100,
    speed: 9,
    attack: 0.8
  },
  magma: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "bomb", "propel", "volcano"],
    fov: 1,
    maxHP: 95,
    maxEnergy: 100,
    attack: 1.1,
    speed: 10.5
  },
  rock: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "splinter", "observatory", "slingshot"],
    speed: 8.5,
    attack: 0.85,
    maxHP: 145,
    maxEnergy: 100,
    fov: 0.85,
  },
  ice: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "streamer", "drown", "ice gunner"],
    fov: 0.95,
    maxHP: 100,
    maxEnergy: 100,
    speed: 10.4,
    attack: 1.1
  },
  plasma: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "bomb", "propel", "ionizer"],
    maxEnergy: 100,
    speed: 10.5,
    attack: 1.35,
    maxHP: 85,
    fov: 1,
  },
  electricity: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "streamer", "drown", "tesla coil"],
    maxEnergy: 100,
    speed: 11,
    attack: 1.15,
    maxHP: 97,
    fov: 1
  },
  metal: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "splinter", "observatory", "cannon"],
    speed: 7.5,
    attack: 1,
    maxHP: 160,
    maxEnergy: 100,
    fov: 0.95
  },
  light: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "bomb", "propel", "laser"],
    speed: 11.5,
		attack: 1.25,
		maxHP: 90,
    maxEnergy: 110,
		fov: 1.1,
  },
  toxin: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "splinter", "observatory", "toxicator"],
    speed: 9.5,
    attack: 1.1,
    maxHP: 120,
    maxEnergy: 100,
    fov: 1
  },
  air: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "streamer", "drown", "blower"],
    speed: 11.5,
    attack: 0.95,
    maxHP: 95,
    fov: 0.85,
    maxEnergy: 100
  },
}
export const TierXP = [0, 1000, 3000, 8000, 20000, Infinity]