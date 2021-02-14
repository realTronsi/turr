/*function reduce_num(n,t){return (n.toString().length > 3)?(x=(""+n).length,p=Math.pow,t=p(10,t),x-=x%3,Math.round(n*t/p(10,x))/t+" KMBTqQsSOND"[x/3]):n};*/
export function reduce_num(value) {
  value = Math.floor(value);
  let newValue = value;
  const suffixes = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = newValue.toPrecision(3);
  if (value < 1000){
    newValue = Math.round(newValue);
  }

  newValue += suffixes[suffixNum];
  return newValue;
}
