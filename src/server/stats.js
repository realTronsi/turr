const ElementStats = {
  basic: {
    speed: 1,
    attack: 1,
    defense: 100,
    fov: 1,
    maxEnergy: 100
  },
  fire: {
    speed: 1.2,
    attack: 1.2,
    defense: 80,
    fov: 0.85,
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
    fov: 1.2,
    maxEnergy: 100
  }

}
const TowerStats = {
  farm: {
    hp: 240,
  },
  turret: {
    hp: 150,
  },
  healer: {
    hp: 320,
  },
  bomb: {
    hp: 160,
  },
  streamer: {
    hp: 210,
  },
  splinter: {
    hp: 170,
  },
  core: {
    hp: 240,
  },
  barrier: {
    hp: 400,
  },
  sandpit: {
    hp: 40,
    decay: 4
  }
}
module.exports = {TowerStats, ElementStats}