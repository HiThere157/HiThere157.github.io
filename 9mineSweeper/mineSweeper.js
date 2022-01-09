var resolution = 40;
var mines = 0.12;

if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  resolution = resolution * 2;
}

var columns = parseInt(window.innerWidth / resolution);
var rows = parseInt(parseInt(window.innerHeight / 10) * 10 / resolution);

var tiles = [];
var xOffPopup = 0;
var yOffPopup = 0;
var playing = true;
var mUp = false;
var firstTry = true;

function checkGame() {
  let remaining = 0;
  tiles.forEach(row => {
    row.forEach(tile => {
      if (tile.show == false && tile.mine == false) {
        remaining += 1;
      }
    });
  });

  return remaining;
}

class Popup {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.open = false;
  }

  show() {
    fill("#888888bb");
    rect(this.x + xOffPopup, this.y + yOffPopup, this.w, this.h);
    fill("#green");
    rect(this.x + 5 + xOffPopup, this.y + 5 + yOffPopup, resolution - 10, resolution - 10);
    fill("red");
    rect(this.x + 5 + xOffPopup, this.y + resolution + 5 + yOffPopup, resolution - 10, resolution - 10);
  }

}

var popup = new Popup(0, 0, resolution, resolution * 2);

class Tile {
  constructor(x, y, p) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.nearMines = "0";
    this.show = false;
    this.recurse = false;
    this.flag = false;

    if (Math.random() < p) {
      this.mine = true;
    }
  }

  countMines() {
    let temp = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (this.x + i >= 0 && this.x + i < columns && this.y + j >= 0 && this.y + j < rows) {
          if (tiles[this.x + i][this.y + j].mine == true) {
            temp += 1;
          }
        }
      }
    }
    this.nearMines = temp.toString();
  }

  showNeightbours() {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (this.x + i >= 0 && this.x + i < columns && this.y + j >= 0 && this.y + j < rows) {
          tiles[this.x + i][this.y + j].showMe();
        }
      }
    }
  }

  showMe() {
    this.show = true;

    if (this.mine == true) {
      if (firstTry) {
        firstTry = false;
        this.mine = false;

        countAllMines()
        this.showMe()

      } else {
        alert("You Lost. Refresh to Play again");
        playing = false;
      }

    } else if (this.nearMines == "0" && this.recurse == false) {
      firstTry = false;
      this.recurse = true;
      this.showNeightbours();
    }
  }

}

for (var i = 0; i < columns; i++) {
  var row = [];
  for (var j = 0; j < rows; j++) {
    row.push(new Tile(i, j, mines));
  }
  tiles.push(row);
}

function countAllMines() {
  tiles.forEach(row => {
    row.forEach(tile => {
      tile.countMines();
    });
  });
}
countAllMines();

function click(b, mX, mY) {
  let tile = tiles[parseInt(mX / resolution)][parseInt(mY / resolution)];

  if (b == "LEFT" && tile.flag == false) {
    tile.showMe();
  } else if (b == "RIGHT" && tile.show == false) {
    tile.flag = !tile.flag;
  }

  if (checkGame() == 0) {
    alert("You Won. Refresh to Play again");
    playing = false;
  }
  mUp = true;
}

function setup() {
  createCanvas(columns * resolution, rows * resolution);
  background("#000");
  frameRate(20);
}

function draw() {
  tiles.forEach(row => {
    row.forEach(tile => {
      if (tile.show == true) {
        fill("#cecece");
      } else {
        fill("#525252");
      }

      rect(tile.x * resolution, tile.y * resolution, resolution, resolution);

      if (tile.flag == true) {
        fill("red");
        rect(tile.x * resolution + resolution * 0.5 - 10, tile.y * resolution + resolution * 0.5 - 10, 20, 20);
      }

      if (tile.show == true) {
        if (tile.mine == true) {
          fill("#000");
          rect(tile.x * resolution + resolution * 0.5 - 10, tile.y * resolution + resolution * 0.5 - 10, 20, 20);

        } else {
          if (tile.nearMines != 0) {
            if (tile.nearMines == "1") {
              fill("blue");
            } else if (tile.nearMines == "2") {
              fill("orange");
            } else {
              fill("red");
            }

            textSize(30);
            text(tile.nearMines, tile.x * resolution + resolution * 0.5 - 10, tile.y * resolution + resolution * 0.5 + 10);
          }
        }
      }
    });
  });

  if (mouseIsPressed && playing == true && mUp == false) {
    var mX = mouseX;
    var mY = mouseY;

    if (mouseButton === LEFT) {
      click("LEFT", mX, mY);
    }
    if (mouseButton === RIGHT) {
      click("RIGHT", mX, mY);
    }
  }

  if (popup.open == true) {
    popup.show();
  }
}

function touchStarted() {
  if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (popup.open == false && playing == true) {
      popup.open = true;
      popup.x = mouseX;
      popup.y = mouseY;

      if (parseInt(popup.y / resolution) > rows - 3) {
        yOffPopup = -2 * resolution;
      } else {
        yOffPopup = 0;
      }

      if (parseInt(popup.x / resolution) > columns - 2) {
        xOffPopup = -resolution;
      } else {
        xOffPopup = 0;
      }

    } else if (popup.open == true) {
      if (mouseX >= popup.x + xOffPopup && mouseX <= popup.x + resolution + xOffPopup && mouseY >= popup.y + yOffPopup && mouseY <= popup.y + resolution + yOffPopup) {
        click("LEFT", popup.x, popup.y);
      } else if (mouseX >= popup.x + xOffPopup && mouseX <= popup.x + resolution + xOffPopup && mouseY >= popup.y + resolution + yOffPopup && mouseY <= popup.y + resolution * 2 + yOffPopup) {
        click("RIGHT", popup.x, popup.y);
      }
      popup.open = false;
    }
  }
}

function mouseReleased() {
  mUp = false;
}

document.addEventListener("contextmenu", event => event.preventDefault());