var points = [];
var wh = window.innerHeight
var ww = window.innerWidth

var settings = {
  nPoints: 400,
  mul: 2,
  scale: 400,
  play: false,
  speed: 1,
  togglePlay: () => { settings.play = !settings.play; },
}

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";
gui.add(settings, "nPoints", 10, 500, 1).onChange(() => { setPoints() });
gui.add(settings, "mul", 1, 100, 1).listen();
gui.add(settings, "scale", 150, 1000).onChange(() => { setPoints() });
gui.add(settings, "togglePlay");

function setPoints() {
  points = [];
  for (var a = 0; a < Math.PI * 2; a += Math.PI * 2 / settings.nPoints) {
    points.push([Math.sin(a) * settings.scale + ww / 2, Math.cos(a) * settings.scale + wh / 2]);
  }
}

function setup() {
  createCanvas(ww, wh - 5);
  background("#000");
  stroke("#aaa");

  setPoints();
  frameRate(60);
}

function draw() {
  background("#000");

  points.forEach((cords, index) => {
    var newIndex = (index * settings.mul) % settings.nPoints;

    line(...cords, ...points[newIndex]);
  });

  if (settings.play && frameCount % 20 == 0) {
    settings.mul += settings.speed
  }
}