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
    speed: 13.5,
    attack: 1,
    fov: 1
  },
  fire: {
    tier: 2,
    upgrades: [
      {color: "#a12020", name: "magma"},
      {color: "#dc4fe3", name: "plasma"}
    ],
    towers: ["farm", "basic", "heal", "bomb", "propel"],
    maxHP: 80,
    maxEnergy: 100,
    speed: 12,
    attack: 1.25,
    fov: 1
  },
  water: {
    tier: 2,
    upgrades: [
      {color: "#4ec4cc", name: "ice"}
    ],
    towers: ["farm", "basic", "heal", "streamer", "drown"],
    fov: 1,
    maxHP: 110,
    maxEnergy: 100,
    speed: 11,
    attack: 1.1
  },
  earth: {
    tier: 2,
    upgrades: [
      {color: "#444444", name: "rock"}
    ],
    towers: ["farm", "basic", "heal", "splinter", "observatory"],
    fov: 0.9,
    maxHP: 140,
    maxEnergy: 100,
    speed: 10,
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
    speed: 11.5
  },
  rock: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "splinter", "observatory", "slingshot"],
    speed: 9.5,
    attack: 0.9,
    maxHP: 145,
    maxEnergy: 100,
    fov: 0.9,
  },
  ice: {
    tier: 3,
    upgrades: [],
    towers: ["farm", "basic", "heal", "streamer", "drown", "ice gunner"],
    fov: 0.95,
    maxHP: 100,
    maxEnergy: 100,
    speed: 11.4,
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
  }
  
}
export const TierXP = [0, 3000, 15000, 50000, 150000, Infinity]