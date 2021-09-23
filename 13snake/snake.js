var gameVars = {
  "resolution": 50,
  "startFood": 4,
  "speed": 10,

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
var speed = gameVars["speed"];

if(gameVars["columns"] == undefined || gameVars["rows"] == undefined){
  var columns = parseInt(w / resolution);
  var rows = parseInt(parseInt(h / 10) * 10 / resolution);
}else{
  var columns = gameVars["columns"];
  var rows = gameVars["rows"];
}

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.n = x + y;

    this.counter = 0;
    this.food = false;
  }
}
var tiles = [];
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    tiles.push(new Tile(x, y));
  }
}

class Snake {
  constructor(d, x, y) {
    this.d = d;
    this.score = 2;
    this.x = x;
    this.y = y;

    this.vx = 1;
    this.vy = 0;

    this.setTitle();
  }

  spawnFood() {
    tiles[parseInt(Math.random() * tiles.length)].food = true;
  }

  setTitle() {
    document.title = `Score: ${this.score}/${columns * rows}`;
  }
}
var snake = new Snake(0, 4, 4);
for (let i = 0; i < gameVars["startFood"]; i++) {
  snake.spawnFood();
}

function setup() {
  createCanvas(columns * resolution, rows * resolution);
  background("#000");
  frameRate(speed);
}

var running = true;
function draw() {
  if (running) {
    background("#000");
    tiles.forEach(tile => {
      if (tile.food) {
        fill("#F00");
        rect(tile.x * resolution + 8, tile.y * resolution + 8, resolution - 16, resolution - 16)
      }

      if (tile.n % 2 == 0) {
        fill("#cecece88");
      } else {
        fill("#cecece77");
      }

      rect(tile.x * resolution, tile.y * resolution, resolution, resolution);
      if (tile.counter > 0) {
        fill("#000")
        let w = 7 - tile.counter * 0.5
        if (w < 2) {
          w = 2;
        }
        rect(tile.x * resolution + w, tile.y * resolution + w, resolution - w * 2, resolution - w * 2);

        if (tiles[snake.y * columns + snake.x].food == false) {
          tile.counter -= 1;
        }
      }
    });

    snake.x += snake.vx;
    snake.y += snake.vy;


    if (tiles[snake.y * columns + snake.x] == undefined || tiles[snake.y * columns + snake.x].counter > 0 || snake.x < 0 || snake.x > columns - 1) {
      running = false;
      alert("You Lost!");
      snake.x -= snake.vx;
      snake.y -= snake.vy;
    } else if (tiles[snake.y * columns + snake.x].food) {
      tiles[snake.y * columns + snake.x].food = false;
      snake.spawnFood();
      snake.score += 1;
      snake.setTitle();
    }

    fill("#F008");
    rect(snake.x * resolution + 2, snake.y * resolution + 2, resolution - 4, resolution - 4);
    tiles[snake.y * columns + snake.x].counter = snake.score;
  }
}

function pressedButton(btn) {
  //left
  if (btn == 37 && snake.vx != 1) {
    snake.vx = -1;
    snake.vy = 0;

    //right
  } else if (btn == 39 && snake.vx != -1) {
    snake.vx = 1;
    snake.vy = 0;

    //up
  } else if (btn == 38 && snake.vy != 1) {
    snake.vy = -1;
    snake.vx = 0;

    //down
  } else if (btn == 40 && snake.vy != -1) {
    snake.vy = 1;
    snake.vx = 0;
  }
}

function keyPressed() {
  pressedButton(keyCode);
}