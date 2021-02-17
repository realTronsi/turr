function ksCalc(s, es) {
  let diff = es - s;
  let reward = Math.pow(es, 0.92) + 500;
  
  if (diff < 0){
    //You have more XP than enemy
    reward += Math.cbrt(diff)*2;
  }
  else{
    //Enemy has more XP than you
    reward += Math.pow(diff, 0.88);
  }
  reward = Math.max(reward, 0);
  reward = Math.min(reward, es*8.5/10 + 500)

  return reward;
}


module.exports = {ksCalc}