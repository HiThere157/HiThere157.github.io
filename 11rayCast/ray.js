var vectors = [];
var walls = [];
var pos = [[], []];

Number.prototype.between = function (a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this >= min && this <= max;
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight-5);
  background("#000");

  for (var a = 0; a < Math.PI * 2; a += Math.PI / 75) {
    vectors.push(createVector(Math.sin(a), Math.cos(a)));
  }

  walls.push([[500, 100], createVector(-500, 600)]);
  walls.push([[50, 100], createVector(500, 100)]);
  walls.push([[100, 600], createVector(600, 50)]);
  walls.push([[700, 200], createVector(50, 200)]);
}

function draw() {
  background("#000")
  strokeWeight(1)
  stroke("#FFF")

  var solutions = {};
  walls.forEach(wall => {
    line(wall[0][0], wall[0][1], wall[0][0] + wall[1].x, wall[0][1] + wall[1].y)
    for (let i = 0; i < vectors.length; i++) {
      var vx = vectors[i].x;
      var vy = vectors[i].y;
      var wx = wall[0][0];
      var wy = wall[0][1];
      var wvx = wall[1].x;
      var wvy = wall[1].y;

      var s = ((wx - mouseX) * wvy + (mouseY - wy) * wvx) / (vx * wvy - vy * wvx)

      var x = mouseX + s * vx;
      var y = mouseY + s * vy;

      if (x.between(wx, wx+wvx) && s > 0) {
        circle(x, y, 3);
        if (solutions[i] == undefined) {
          solutions[i] = [[x, y]];
        } else {
          solutions[i].push([x, y]);
        }
      }
    }
  });

  for (let i = 0; i < vectors.length; i++) {
    if (solutions[i] == undefined) {
      line(mouseX, mouseY, mouseX + vectors[i].x * 5000, mouseY + vectors[i].y * 5000);
    } else {
      if (solutions[i].length == 1) {
        line(mouseX, mouseY, solutions[i][0][0], solutions[i][0][1]);
      } else {
        var d = [];
        solutions[i].forEach(solution => {
          d.push(Math.pow(mouseX - solution[0], 2) + Math.pow(mouseY - solution[1], 2));
        });
        var index = d.indexOf(Math.min(...d));
        line(mouseX, mouseY, solutions[i][index][0], solutions[i][index][1]);
      }
    }
  }

  if (pos[1].length != 0) {
    line(pos[0][0], pos[0][1], pos[1][0], pos[1][1]);
  }
}


function mouseDragged() {
  if (pos[0].length == 0) {
    pos[0] = [mouseX, mouseY];
  }

  pos[1] = [mouseX, mouseY];
  // prevent default
  return false;
}

function mouseReleased() {
  walls.push([pos[0], createVector(pos[1][0] - pos[0][0], pos[1][1] - pos[0][1])])
  pos = [[], []];
  // prevent default
  return false;
}