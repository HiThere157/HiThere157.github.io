p5.disableFriendlyErrors = true;
var resolution = 120;
var nCircles = 4 + 1;

class Circle {
  constructor(x, y, da, h) {
    this.x = x + resolution / 2;
    this.y = y + resolution / 2;
    this.h = h;

    this.a = 0;
    this.da = da;

    this.px = 0;
    this.py = 0;
  }

  updatePoint() {
    this.a += this.da / 50;

    if (this.a >= Math.PI * 2) {
      this.a += Math.PI * 2;
    }

    this.px = this.x + Math.sin(this.a) * resolution / 2;
    this.py = this.y + Math.cos(this.a) * resolution / 2;
  }

  drawCirlce() {
    circle(this.x, this.y, resolution);

    if (this.h) {
      line(this.px, this.py, 1000, this.py);
    } else {
      line(this.px, this.py, this.px, 1000);
    }
  }

}

function setup() {
  createCanvas(resolution * nCircles + (nCircles + 1) * 40, resolution * nCircles + (nCircles + 1) * 40);
  background("#000");
  frameRate(30);
  stroke("#fff");
  strokeWeight(2);
  noFill();
}

var circles = [[], []];
var points = [];
for (let i = 1; i < nCircles; i++) {
  circles[0].push(new Circle(i * resolution + (i * 40), 10, Math.PI / (nCircles - i), false));
  circles[1].push(new Circle(10, i * resolution + (i * 40), Math.PI / (nCircles - i), true));
}

for (let i = 0; i < nCircles - 1; i++) {
  var row = [];
  for (let j = 0; j < nCircles - 1; j++) {
    row.push([]);
  }

  points.push(row);
}

function draw() {
  background("#000");

  stroke("#008");
  strokeWeight(2);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let n = 0; n < points[i][j].length; n++) {
        point(...points[i][j][n]);
      }
    }
  }

  stroke("#fff");

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      var c = circles[i][j];

      c.updatePoint();
      c.drawCirlce();
    }
  }

  stroke("#f00");
  strokeWeight(10);

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      var c = circles[i][j];

      point(c.px, c.py);
    }
  }

  for (let x = 0; x < nCircles - 1; x++) {
    for (let y = 0; y < nCircles - 1; y++) {
      var p = points[x][y];
      var len = p.push([circles[0][x].px, circles[1][y].py]);

      if (len > 500) {
        p.shift();
      }

    }
  }
}