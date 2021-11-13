var w = window.innerWidth;
var h = window.innerHeight;

var settings = {
  res: 20,
  threshold: 0.5,
  freq: 5,
  dx: 0,
  dy: 0,
  changeSeed: () => { noiseSeed(parseInt(Math.random() * 100)); }
}

const gui = new dat.GUI();
gui.domElement.parentElement.style.zIndex = 1;
gui.add(settings, "res", 10, 50).onChange(() => { updateSize() });
gui.add(settings, "threshold", 0, 1);
gui.add(settings, "freq", 1, 30);
gui.add(settings, "dx", -25, 25);
gui.add(settings, "dy", -25, 25);
gui.add(settings, "changeSeed");

var columns, rows, points;

function isInside(x, y) {
  return parseInt(noise(x / settings.freq + settings.dx, y / settings.freq + settings.dy) < settings.threshold ? 1 : 0);
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.inside;
  }

  updateInside() {
    this.inside = isInside(this.x, this.y);
  }

  draw() {
    this.inside ? fill("red") : fill("white");
    noStroke();
    circle(this.x * settings.res + 0.5 * settings.res, this.y * settings.res + 0.5 * settings.res, settings.res / 5);
    stroke(255);
  }

  drawLines() {
    let ident = parseInt([this.inside, points[this.x + 1][this.y].inside, points[this.x][this.y + 1].inside, points[this.x + 1][this.y + 1].inside].map(b => { return b ? 1 : 0 }).join(""), 2);
    lookupTable[ident].forEach(l => {
      let tmp = l.map(coord => { return coord * settings.res + settings.res * 0.5 });
      line(tmp[0] + this.x * settings.res, tmp[1] + this.y * settings.res, tmp[2] + this.x * settings.res, tmp[3] + this.y * settings.res);
    });
  }
}

function updateSize() {
  columns = parseInt(w / settings.res);
  rows = parseInt(parseInt(h / 10) * 10 / settings.res);

  points = []
  for (let i = 0; i < columns; i++) {
    let tmp = [];
    for (let j = 0; j < rows; j++) {
      tmp.push(new Point(i, j));
    }

    points.push(tmp);
  }
}
updateSize();

function setup() {
  createCanvas(columns * settings.res, rows * settings.res);
  background("#000");
  frameRate(20);
}

var lookupTable = {
  0: [[]],
  15: [[]],

  //1 inside
  8: [[0.5, 0, 0, 0.5]],
  4: [[0.5, 0, 1, 0.5]],
  2: [[0.5, 1, 0, 0.5]],
  1: [[0.5, 1, 1, 0.5]],

  //3 inside
  7: [[0.5, 0, 0, 0.5]],
  11: [[0.5, 0, 1, 0.5]],
  13: [[0.5, 1, 0, 0.5]],
  14: [[0.5, 1, 1, 0.5]],

  //2 inside next to each other
  5: [[0.5, 0, 0.5, 1]],
  3: [[0, 0.5, 1, 0.5]],
  12: [[0, 0.5, 1, 0.5]],
  10: [[0.5, 0, 0.5, 1]],

  //2 inside across
  6: [[0.5, 0, 1, 0.5], [0, 0.5, 0.5, 1]],
  9: [[0.5, 0, 0, 0.5], [0.5, 1, 1, 0.5]]
}

function draw() {
  background("#000");

  points.forEach((column) => {
    column.forEach((point) => {
      point.updateInside();
    })
  });

  points.forEach((column, indexC) => {
    column.forEach((point, indexR) => {
      point.draw();

      if (indexC != columns - 1 && indexR != rows - 1) {
        point.drawLines();
      }
    })
  });
}

// var changePoint = () => {
//   let tmp = [mouseX, mouseY].map(coord => { return parseInt((coord - settings.res * 0.5) / settings.res + 0.5) });
//   let point = points[tmp[0]][tmp[1]];
//   point.inside = !point.inside;
// }
// function mouseClicked() {
//   changePoint();
// }