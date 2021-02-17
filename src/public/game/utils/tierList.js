export const ElementTiers = {
  basic: {
    tier: 1,
    upgrades: [
      {color: "#f72828", name: "fire"},
      {color: "#2889de", name: "water"},
      {color: "#27b039", name: "earth"}
    ],
    towers: ["farm", "basic", "heal"],
    fov: 1,
    maxHP: 100,
    maxEnergy: 100
  },
  fire: {
    tier: 2,
    upgrades: [],
    towers: ["farm", "basic", "heal", "bomb", "propel"],
    fov: 1,
    maxHP: 85,
    maxEnergy: 100
  },
  water: {
    tier: 2,
    upgrades: [],
    towers: ["farm", "basic", "heal", "streamer", "drown"],
    fov: 1,
    maxHP: 110,
    maxEnergy: 100
  },
  earth: {
    tier: 2,
    upgrades: [],
    towers: ["farm", "basic", "heal", "splinter", "observatory"],
    fov: 0.9,
    maxHP: 140,
    maxEnergy: 100
  }
}
export const TierXP = [0, 3000, 15000, 50000, 150000, Infinity]