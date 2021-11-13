var w = window.innerWidth;
var h = window.innerHeight;

var settings = {
  res: 20,
  threshold: 0.5,
  freq: 5,
  dx: 25,
  dy: 25,
  changeSeed: () => {
    noiseSeed(parseInt(Math.random() * 100));
    updateAllInside();
  }
}

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";
gui.add(settings, "res", 10, 50).onChange(() => { updateSize() });
gui.add(settings, "threshold", 0, 1).onChange(() => { updateAllInside() });
gui.add(settings, "freq", 1, 30).onChange(() => { updateAllInside() });
gui.add(settings, "dx", 0, 50).onChange(() => { updateAllInside() });
gui.add(settings, "dy", 0, 50).onChange(() => { updateAllInside() });
gui.add(settings, "changeSeed").onChange(() => { updateAllInside() });

var columns, rows, points;
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

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.inside;
  }

  updateInside() {
    try {
      this.inside = parseInt(noise(this.x / settings.freq + settings.dx, this.y / settings.freq + settings.dy) < settings.threshold ? 1 : 0);
    } catch { }
  }

  draw() {
    this.inside ? fill("#f00") : fill("#222");
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

//on resolution change
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
  updateAllInside();
}
updateSize();

//on basically every setting change
function updateAllInside() {
  points.forEach((column) => {
    column.forEach((point) => {
      point.updateInside();
    })
  });
}

function setup() {
  createCanvas(columns * settings.res, rows * settings.res);
  background("#000");
  updateAllInside();
  frameRate(20);
}

function draw() {
  background("#000");

  points.forEach((column, indexC) => {
    column.forEach((point, indexR) => {
      point.draw();

      if (indexC != columns - 1 && indexR != rows - 1) {
        point.drawLines();
      }
    })
  });
}

function mouseClicked() {
  let tmp = [mouseX, mouseY].map(coord => { return parseInt((coord - settings.res * 0.5) / settings.res + 0.5) });
  let point = points[tmp[0]][tmp[1]];
  point.inside = !point.inside;
}