var tiles = [];
var resolution = 40;
if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  resolution *= 2;
}

var xOff_popup = 0;
var yOff_popup = 0;
var playing = true;
var mUp = false;
//vertival/horizontal = 1/4 => 4x horizontal
var mines = 0.12;
var columns = parseInt(window.innerWidth / resolution);
var rows = parseInt(parseInt(window.innerHeight / 10) * 10 / resolution);


var params = window.location.search.substr(1).split(",");
if (params.length == 3) {
  resolution = params[0];
  columns = params[1];
  rows = params[2];
}

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
    rect(this.x + xOff_popup, this.y + yOff_popup, this.w, this.h);
    fill("#green");
    rect(this.x + 5 + xOff_popup, this.y + 5 + yOff_popup, resolution - 10, resolution - 10);
    fill("red");
    rect(this.x + 5 + xOff_popup, this.y + resolution + 5 + yOff_popup, resolution - 10, resolution - 10);

    /*
    strokeWeight(0);
    fill("#18cf18")
    rect(this.x+5+xOff_popup+1/5*resolution, this.y+5+yOff_popup+1/5*resolution, 1/2.5*resolution, 1/2.5*resolution)        

    fill("#FF0000");
    rect(this.x+5+xOff_popup+9, this.y+resolution+5+yOff_popup+30, 20, 5)
    rect(this.x+5+xOff_popup+15, this.y+resolution+5+yOff_popup+7, 5, 24)
    triangle(this.x+5+xOff_popup+17, this.y+resolution+5+yOff_popup+7, this.x+5+xOff_popup+17, this.y+resolution+5+yOff_popup+15, this.x+5+xOff_popup+35, this.y+resolution+5+yOff_popup+11)

    strokeWeight(1)*/
  }

}

var popup = new Popup(0, 0, resolution, resolution * 2);

class Tile {
  constructor(x, y, p) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.mines_near = "0";
    this.show = false;
    this.re = false;
    this.flag = false;

    if (Math.random() < p) {
      this.mine = true;
      //this.show = true;
    }
  }

  count_mines() {
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
    this.mines_near = temp.toString();
  }

  showNeightbours() {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (this.x + i >= 0 && this.x + i < columns && this.y + j >= 0 && this.y + j < rows) {
          tiles[this.x + i][this.y + j].showMe();
          ;
        }
      }
    }
  }

  showMe() {
    this.show = true;
    if (this.mine == true) {
      alert("You Lost. Refresh to Play again");
      playing = false;
    } else if (this.mines_near == "0" && this.re == false) {
      this.re = true;
      this.showNeightbours();
    }
  }

}

for (var i = 0; i < columns; i++) {
  var tempRow = [];
  for (var j = 0; j < rows; j++) {
    tempRow.push(new Tile(i, j, mines));
  }
  tiles.push(tempRow);
}

tiles.forEach(row => {
  row.forEach(tile => {
    tile.count_mines();
  });
});

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
  let canvas = createCanvas(columns * resolution, rows * resolution);
  background("#000");
  xOff = parseInt((window.innerWidth - columns * resolution) / 2);
  yOff = parseInt((window.innerHeight - rows * resolution) / 2);
  canvas.position(xOff, yOff);
}

function draw() {
  tiles.forEach(row => {
    row.forEach(tile => {
      if (tile.show == true) {
        fill("cecece");
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
          if (tile.mines_near != 0) {
            if (tile.mines_near == "1") {
              fill("blue");
            } else if (tile.mines_near == "2") {
              fill("orange");
            } else {
              fill("red");
            }

            textSize(30);
            text(tile.mines_near, tile.x * resolution + resolution * 0.5 - 10, tile.y * resolution + resolution * 0.5 + 10);
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
        yOff_popup = -2 * resolution;
      } else {
        yOff_popup = 0;
      }

      if (parseInt(popup.x / resolution) > columns - 2) {
        xOff_popup = -resolution;
      } else {
        xOff_popup = 0;
      }

    } else if (popup.open == true) {
      if (mouseX >= popup.x + xOff_popup && mouseX <= popup.x + resolution + xOff_popup && mouseY >= popup.y + yOff_popup && mouseY <= popup.y + resolution + yOff_popup) {
        click("LEFT", popup.x, popup.y);
      } else if (mouseX >= popup.x + xOff_popup && mouseX <= popup.x + resolution + xOff_popup && mouseY >= popup.y + resolution + yOff_popup && mouseY <= popup.y + resolution * 2 + yOff_popup) {
        click("RIGHT", popup.x, popup.y);
      }
      popup.open = false;
    }
  }
}

function mouseReleased() {
  mUp = false;
}

document.addEventListener('contextmenu', event => event.preventDefault());