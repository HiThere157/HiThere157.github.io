p5.disableFriendlyErrors = true;
var settings = {
  scale: 10,
  dt: 0.005,
  a: 10,
  b: 28,
  c: 8 / 3,
  resetToDefault: () => {
    settings.a = 10;
    settings.b = 28;
    settings.c = 8 / 3;
    settings.dt = 0.005;
    settings.deletePoints();
  },
  deletePoints: () => {
    points = [];
    settings.nPoints = 0;
    [x, y, z] = [0.1, 0, 0];
  },
  nPoints: 0
}

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";
gui.add(settings, "scale", 5, 40);
gui.add(settings, "dt", 0.001, 0.01).listen();
gui.add(settings, "a", 1, 50).onChange(() => { settings.deletePoints() }).listen();
gui.add(settings, "b", 1, 50).onChange(() => { settings.deletePoints() }).listen();
gui.add(settings, "c", 1, 50).onChange(() => { settings.deletePoints() }).listen();
gui.add(settings, "resetToDefault");

var nPoints = gui.add(settings, "nPoints", 0, 0).listen();
nPoints.domElement.style.pointerEvents = "none";

gui.add(settings, "deletePoints");

var points = [];
var [x, y, z] = [0.1, 0, 0];

function setup() {
  createCanvas(window.innerWidth - 10, window.innerHeight - 10, WEBGL);
  background("#000");
  stroke("#fff");
  strokeWeight(2);
  noFill();
}

function draw() {
  background("#000");
  stroke("#f00");
  sphere(3);
  stroke("#fff");
  orbitControl(4, 4, 0.6);

  if(settings.nPoints < 6000){
    points.push([x, y, z]);

    let dx = (settings.a * (y - x)) * settings.dt;
    let dy = (x * (settings.b - z) - y) * settings.dt;
    let dz = (x * y - settings.c * z) * settings.dt;
  
    x += dx;
    y += dy;
    z += dz;
    
    settings.nPoints += 1;
  }

  beginShape();
  points.forEach(point => {
    vertex(...point.map(coord => { return coord * settings.scale }));
  });
  endShape();
}