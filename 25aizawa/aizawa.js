var settings = {
  scale: 200,
  dt: 0.01,
  a: 0.95,
  b: 0.7,
  c: 0.6,
  d: 3.5,
  e: 0.25,
  f: 0.1,

  resetToDefault: () => {
    settings.a = 0.95;
    settings.b = 0.7;
    settings.c = 0.6;
    settings.d = 3.5;
    settings.e = 0.25;
    settings.f = 0.1;
    settings.dt = 0.01;
    settings.nPoints = 1000;
    settings.newPoints();
  },

  nPoints: 1000,
  newPoints: () => {
    points = [];
    for (let i = 0; i < settings.nPoints; i++) {
      points.push(new Point(Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25))
    }
  }
}

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";
gui.add(settings, "scale", 100, 300);
gui.add(settings, "dt", 0.001, 0.01).listen();
gui.add(settings, "a", 0, 5).listen();
gui.add(settings, "b", 0, 5).listen();
gui.add(settings, "c", 0, 5).listen();
gui.add(settings, "d", 0, 5).listen();
gui.add(settings, "e", 0, 5).listen();
gui.add(settings, "f", 0, 5).listen();
gui.add(settings, "resetToDefault");

gui.add(settings, "nPoints", 100, 3000).onChange(() => { settings.newPoints() }).listen();
gui.add(settings, "newPoints");

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updatePos() {
    this.x += ((this.z - settings.b) * this.x - settings.d * this.y) * settings.dt;
    this.y += (settings.d * this.x + (this.z - settings.b) * this.y) * settings.dt;
    this.z += (settings.c + settings.a * this.z - (Math.pow(this.z, 3) / 3) - (Math.pow(this.x, 2) + Math.pow(this.y, 2)) * (1 + settings.e * this.z) + settings.f * this.z * (Math.pow(this.x, 3))) * settings.dt;

    point(this.x * settings.scale, this.y * settings.scale, this.z * settings.scale);
  }
}

var points = [];
function setup() {
  createCanvas(window.innerWidth - 10, window.innerHeight - 10, WEBGL);
  background("#000");
  stroke("#fff");
  strokeWeight(5);
  settings.newPoints();
}

function draw() {
  background("#000");
  orbitControl(2, 2, 0.5);

  points.forEach((p) => {
    p.updatePos()
  })
}