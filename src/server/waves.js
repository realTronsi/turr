function spawnWave(arena){
  if (arena.wave == 1) {
    arena.spawnWaveEnemy("ninja", 6)
  }
  else if (arena.wave == 2) {
    arena.spawnWaveEnemy("ninja", 4)
    arena.spawnWaveEnemy("soldier", 4)
  }
  else if (arena.wave == 3) {
    arena.spawnWaveEnemy("ninja", 2)
    arena.spawnWaveEnemy("archer", 3)
    arena.spawnWaveEnemy("soldier", 3)
  }
  else if (arena.wave == 4){
    arena.spawnWaveEnemy("archer", 6)
  }
  else if (arena.wave == 5){
    arena.spawnWaveEnemy("archer", 2)
    arena.spawnWaveEnemy("machine gunner", 2)
    arena.spawnWaveEnemy("ninja", 2)
  }
  else if (arena.wave == 6){
    arena.spawnWaveEnemy("machine gunner", 6)
  }
  


  
}
module.exports = { spawnWave };