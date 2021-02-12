module.exports = function canvas_resize(canvas) {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let scale = window.innerWidth / canvas.width;
  if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
    scale = window.innerHeight / canvas.height;
  }
  let leftBorder = windowWidth - canvas.width / 2;
  let topBorder = windowHeight - canvas.height / 2;
  canvas.style.transform = "scale(" + scale + ")";
  canvas.style.left = (1 / 2) * (windowWidth - canvas.width) + "px";
  canvas.style.top = (1 / 2) * (windowHeight - canvas.height) + "px";
}

