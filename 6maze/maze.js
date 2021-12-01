var gameVars = {
  "resolution": 50,
  "horizontalBias": 1,

  "columns": undefined,
  "rows": undefined
}

let getParam = window.location.search.substr(1).split("&");
let gameVarKeys = Object.keys(gameVars);
getParam.forEach(param => {
  let tmp = param.split("=");
  if(gameVarKeys.indexOf(tmp[0]) != -1){
    gameVars[tmp[0]] = parseInt(tmp[1]);
  }
});

var w = window.innerWidth;
var h = window.innerHeight;
var resolution = gameVars["resolution"];
var horizontalBias = gameVars["horizontalBias"];

if(gameVars["columns"] == undefined || gameVars["rows"] == undefined){
  var columns = parseInt(w / resolution);
  var rows = parseInt(parseInt(h / 10) * 10 / resolution);
}else{
  var columns = gameVars["columns"];
  var rows = gameVars["rows"];
}

var player;
var mobile = false;
var tiles = [];
var visitedN = 0;
//vertival/horizontal = 1/4 => 4x horizontal

class Tile {
  constructor(x, y, p) {
    this.x = x;
    this.y = y;
    this.p = p;
    this.walls = [0, 0];
    this.visited = false;

    for (var n = 0; n < 2; n++) {
      if (Math.random() < p) {
        this.walls[n] = 1;
      }
    }

    this.start = false;
    this.finish = false;
  }
  setStart() {
    this.start = true;
    player = new Player(this.x, this.y);
  }

  setFinish() {
    this.finish = true;
    player.setFinish(this.x, this.y);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  setFinish(x, y) {
    this.finishX = x;
    this.finishY = y;
  }
}

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.stack = [];
  }

  getRandomNeighbour() {
    this.neighbours = [];
    var tileN = null;
    [0, 1, 2, 3].forEach(t => {
      tileN = null;
      if (t == 0) {
        if (this.y - 1 >= 0) {
          tileN = tiles[this.x][this.y - 1];
        }
      } else if (t == 1) {
        if (this.x + 1 < columns) {
          tileN = tiles[this.x + 1][this.y];
        }
      } else if (t == 2) {
        if (this.y + 1 < rows) {
          tileN = tiles[this.x][this.y + 1];
        }
      } else if (t == 3) {
        if (this.x - 1 >= 0) {
          tileN = tiles[this.x - 1][this.y];
        }
      }

      if (tileN != null) {
        if (tileN.visited == false) {
          if (t == 1 || t == 3) {
            for (var n = 0; n < parseInt(1 / horizontalBias); n++) {
              this.neighbours.push(tileN);
            }
          } else {
            this.neighbours.push(tileN);
          }
        }
      }
    });

    if (this.neighbours.length > 0) {
      return this.neighbours[parseInt(Math.random() * this.neighbours.length)];
    } else {
      return null;
    }
  }
}

for (var i = 0; i < columns; i++) {
  var tempRow = []
  for (var j = 0; j < rows; j++) {
    tempRow.push(new Tile(i, j, 1));
  }
  tiles.push(tempRow);
}

tiles[parseInt(Math.random() * columns)][parseInt(Math.random() * rows)].setStart()

do {
  var temp = tiles[parseInt(Math.random() * columns)][parseInt(Math.random() * rows)];
  if (temp.start == false) {
    temp.setFinish()
  }
} while (temp.finish != true)

var pass = false;
var walker = new Walker(0, 0);
while (visitedN < columns * rows) {
  if (pass == false) {
    walker.stack.push([walker.x, walker.y]);
  } else {
    pass = false;
  }

  if (tiles[walker.x][walker.y].visited == false) {
    tiles[walker.x][walker.y].visited = true;
    visitedN += 1;
  }

  var selectedNeighbour = walker.getRandomNeighbour()

  if (selectedNeighbour != null) {
    var dX = selectedNeighbour.x - walker.x
    var dY = selectedNeighbour.y - walker.y

    if (dX == 1 && dY == 0) {
      tiles[walker.x + 1][walker.y].walls[1] = 0;
    } else if (dX == -1 && dY == 0) {
      tiles[walker.x][walker.y].walls[1] = 0;
    } else if (dX == 0 && dY == 1) {
      tiles[walker.x][walker.y + 1].walls[0] = 0;
    } else if (dX == 0 && dY == -1) {
      tiles[walker.x][walker.y].walls[0] = 0;
    }

    walker.x = selectedNeighbour.x;
    walker.y = selectedNeighbour.y;
  } else {
    walker.stack.pop()
    pass = true;

    walker.x = walker.stack[walker.stack.length - 1][0]
    walker.y = walker.stack[walker.stack.length - 1][1]
  }
}

function setup() {
  frameRate(10);
  createCanvas(columns * resolution, rows * resolution);
  background("#000");

  if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true;
  }
}

function draw() {
  tiles.forEach(row => {
    row.forEach(tile => {
      fill("#525252");
      rect(tile.x * resolution, tile.y * resolution, resolution, resolution);

      let temp = tile.walls;
      fill("#000");
      if (temp[0] == 1 && tile.y != 0) {
        rect(tile.x * resolution, tile.y * resolution - 3, resolution, 6)
      }
      if (temp[1] == 1 && tile.x != 0) {
        rect(tile.x * resolution - 3, tile.y * resolution, 6, resolution)
      }

      if (tile.start == true) {
        fill("red");
        rect(tile.x * resolution + resolution * 0.5 - 5, tile.y * resolution + resolution * 0.5 - 5, 10, 10)
      } else if (tile.finish == true) {
        fill("green")
        rect(tile.x * resolution + resolution * 0.5 - 5, tile.y * resolution + resolution * 0.5 - 5, 10, 10)
      }

      /*if(tile.visited == true){
          fill("purple")
          rect(tile.x*resolution+resolution*0.5-5, tile.y*resolution+resolution*0.5-5, 10, 10)
      }*/
    });
  });

  fill("yellow");
  rect(player.x * resolution + resolution * 0.5 - 10, player.y * resolution + resolution * 0.5 - 10, 20, 20)

  if (mobile) {
    noStroke();
    fill(255, 0, 0, 20);
    rect(w * 0.2, 0, w * 0.6, h * 0.25);
    rect(w * 0.2, h - h * 0.25, w * 0.6, h * 0.25);
    rect(0, h * 0.25, w * 0.4, h * 0.5);
    rect(w - w * 0.4, h * 0.25, w * 0.4, h * 0.5);
    stroke(0, 0, 0);
  }
}

function pressedButton(btn) {
  //left
  if (btn == 37 && player.x > 0) {
    if (tiles[player.x][player.y].walls[1] == 0) {
      player.x -= 1;
    }
    //right
  } else if (btn == 39 && player.x < columns - 1) {
    if (tiles[player.x + 1][player.y].walls[1] == 0) {
      player.x += 1;
    }
    //up
  } else if (btn == 38 && player.y > 0) {
    if (tiles[player.x][player.y].walls[0] == 0) {
      player.y -= 1;
    }
    //down
  } else if (btn == 40 && player.y < rows - 1) {
    if (tiles[player.x][player.y + 1].walls[0] == 0) {
      player.y += 1;
    }
  }

  if (player.x == player.finishX && player.y == player.finishY) {
    alert("YOU WON!")
    location.reload()
  }
}

function keyPressed() {
  pressedButton(keyCode);
}

function touchStarted() {
  let mx = mouseX;
  let my = mouseY;

  if (mx >= 0 && mx <= w * 0.4 && my >= h * 0.25 && my <= h * 0.75) {
    pressedButton(37);
  } else if (mx >= w * 0.6 && mx <= w && my >= h * 0.25 && my <= h * 0.75) {
    pressedButton(39);
  } else if (mx >= w * 0.2 && mx <= w * 0.8 && my >= 0 && my <= h * 0.25) {
    pressedButton(38);
  } else if (mx >= w * 0.2 && mx <= w * 0.8 && my >= h * 0.75 && my <= h) {
    pressedButton(40);
  }
}