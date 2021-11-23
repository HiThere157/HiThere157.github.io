var settings = {
  a: 0.5,
  play: false,
  showLines: true,
  speed: 120,
  colors: ["#fff", "#666", "#333", "#f00"],
  togglePlay: () => { settings.play = !settings.play; },
  toggleLines: () => { settings.showLines = !settings.showLines; }
}

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";
gui.add(settings, "a", 0, 1).listen();
gui.add(settings, "speed", 80, 150).listen();
gui.add(settings, "togglePlay");
gui.add(settings, "toggleLines");

function setup() {
  createCanvas(window.innerWidth - 10, window.innerHeight - 10);
  background("#000");
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(depth) {
    let col = settings.colors[depth];
    if (col != undefined) {
      fill(col);
    }

    if (settings.showLines || depth == 0 || depth == points.length - 1) {
      circle(this.x, this.y, depth == 0 ? 15 : 10);
    }
  }

  drawIntPoint(nextX, nextY, depth, index) {
    let dx = (nextX - this.x) * settings.a;
    let dy = (nextY - this.y) * settings.a;

    points[depth + 1][index] = new Point(this.x + dx, this.y + dy);
  }
}

var points = [[], [], [], []];
points[0].push(new Point(200, 400));
points[0].push(new Point(350, 250));
points[0].push(new Point(450, 250));
points[0].push(new Point(600, 400));

function draw() {
  background("#000");
  noFill();
  stroke("#f00");
  strokeWeight(3);
  bezier(...points[0].map(point => { return [point.x, point.y] }).flat());
  stroke("#fff");
  strokeWeight(1);

  points.forEach((pointGroup, j) => {
    pointGroup.forEach((point, i) => {
      if (i < pointGroup.length - 1) {
        if (settings.showLines || (j == 0 && i != 1)) {
          line(point.x, point.y, pointGroup[i + 1].x, pointGroup[i + 1].y);
        }
        point.drawIntPoint(pointGroup[i + 1].x, pointGroup[i + 1].y, j, i);
      }

      point.draw(j);
    });
  })

  if (settings.play) {
    settings.a = Math.abs((frameCount % settings.speed * 2) / settings.speed - 1);
  }
}

var draggedPoint;
function mousePressed() {
  points[0].forEach(point => {
    if (Math.pow(point.x - mouseX, 2) + Math.pow(point.y - mouseY, 2) < 120) {
      draggedPoint = point;
    }
  });
}

function mouseDragged() {
  if (draggedPoint != undefined) {
    draggedPoint.x = mouseX;
    draggedPoint.y = mouseY;
  }
}

function mouseReleased() {
  draggedPoint = undefined;
}