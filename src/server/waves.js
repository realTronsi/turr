function spawnWave(arena){
  if (arena.wave == 1) {
    arena.spawnWaveEnemy("soldier", 6)
  }
  else if (arena.wave == 2) {
    arena.spawnWaveEnemy("ninja", 4)
    arena.spawnWaveEnemy("machine gunner", 4)
  }
  else if (arena.wave == 3) {
    arena.spawnWaveEnemy("ninja", 2)
    arena.spawnWaveEnemy("machine gunner", 3)
    arena.spawnWaveEnemy("soldier", 3)
  }
  else if (arena.wave == 4){
    arena.spawnWaveEnemy("tank", 4)
  }
  else if (arena.wave == 5){
    arena.spawnWaveEnemy("tank", 3)
    arena.spawnWaveEnemy("strong", 3)
    arena.spawnWaveEnemy("ninja", 3)
  }
  else if (arena.wave == 6){
    arena.spawnWaveEnemy("tadpole", 4)
  }
  else if (arena.wave == 7){
    arena.spawnWaveEnemy("frog", 6)
  }
  


  
}
module.exports = { spawnWave };