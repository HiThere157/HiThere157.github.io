const settings = {
  resolution: 50,
  speed: 25
}

class Walker {
  static isWalking = true;

  constructor() {
    this.currentTile = Tile.tiles[0][0];
    this.currentTile.visited = true;
    this.backTrackStack = [];
  }

  walk() {
    this.draw();

    if (!Walker.isWalking) {
      return;
    }

    let neighbors = this.currentTile.getAllNeighbors().filter(tile => !tile.visited);
    if (neighbors.length == 0) {
      this.backTrack();
      return;
    }

    this.backTrackStack.push(this.currentTile);

    let nextTile = neighbors[Math.floor(Math.random() * neighbors.length)];
    let direction = this.getDirection(nextTile);
    Tile.tiles[this.currentTile.x + direction[0]][this.currentTile.y + direction[1]].walls[direction[2]] = false;

    this.currentTile = nextTile;
    this.currentTile.visited = true;
  }

  backTrack() {
    if (this.backTrackStack.length == 0) {
      Walker.isWalking = false;
      return;
    }
    let tile = this.backTrackStack.pop();
    this.currentTile = tile;
  }

  getDirection(neighbor) {
    if (neighbor.x > this.currentTile.x) {
      // right
      return [0, 0, 1];
    } else if (neighbor.x < this.currentTile.x) {
      // left
      return [-1, 0, 1];
    } else if (neighbor.y > this.currentTile.y) {
      // down
      return [0, 1, 0];
    } else if (neighbor.y < this.currentTile.y) {
      // up
      return [0, 0, 0];
    }
  }

  draw() {
    let res = settings.resolution;
    fill(255);
    noStroke();
    rect(this.currentTile.x * res, this.currentTile.y * res, res, res);
    stroke(255);
  }
}

class Tile {
  static walker;
  static tiles = [];
  static rows = 0;
  static columns = 0;

  static createTiles() {
    let res = settings.resolution;
    Tile.rows = Math.floor(windowWidth / res);
    Tile.columns = Math.floor(windowHeight / res);
    resizeCanvas(Tile.rows * res, Tile.columns * res);

    let tiles = [];
    for (let i = 0; i < Tile.rows; i++) {
      tiles[i] = [];
      for (let j = 0; j < Tile.columns; j++) {
        tiles[i][j] = new Tile(i, j);
      }
    }
    Tile.tiles = tiles;
    Tile.walker = new Walker();
    Walker.isWalking = true;
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
    // top, right
    this.walls = [true, true];

    this.visited = false;
  }

  getAllNeighbors() {
    let neighbors = [];
    if (this.y > 0) {
      neighbors.push(Tile.tiles[this.x][this.y - 1]);
    }
    if (this.y < Tile.columns - 1) {
      neighbors.push(Tile.tiles[this.x][this.y + 1]);
    }
    if (this.x > 0) {
      neighbors.push(Tile.tiles[this.x - 1][this.y]);
    }
    if (this.x < Tile.rows - 1) {
      neighbors.push(Tile.tiles[this.x + 1][this.y]);
    }

    return neighbors;
  }
}

function initOverlay() {
  const pane = new Tweakpane.Pane();

  const general = pane.addFolder({ title: "Maze Settings" });
  general.addInput(settings, "resolution", { min: 20, max: 100, step: 1, label: "Resolution" }).on("change", Tile.createTiles);
  general.addInput(settings, "speed", { min: 1, max: 75, step: 1, label: "Speed" }).on("change", () => { frameRate(settings.speed); });
  general.addButton({ title: "Generate Maze" }).on("click", Tile.createTiles);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(settings.speed);
  Tile.createTiles();
  initOverlay();
}

function draw() {
  background(0);
  let res = settings.resolution;

  try {
    for (let i = 0; i < Tile.rows; i++) {
      for (let j = 0; j < Tile.columns; j++) {
        var tile = Tile.tiles[i][j];

        var x = tile.x * res;
        var y = tile.y * res;

        if (!tile.visited) {
          fill(40);
          rect(x, y, res, res);
        }

        if (tile.walls[0]) {
          line(x, y, x + res, y);
        }
        if (tile.walls[1]) {
          line(x + res, y, x + res, y + res);
        }

        if (tile.x == 0) {
          line(x, y, x, y + res);
        }
        if (tile.y == Tile.columns - 1) {
          line(x, y + res, x + res, y + res);
        }
      }
    }

    Tile.walker.walk();

    if (!Walker.isWalking) {
      fill(0, 255, 0);
      let diff = res * 0.2;
      rect((Tile.rows - 1) * res + diff, (Tile.columns - 1) * res + diff, res - diff * 2, res - diff * 2);
    }

  } catch {
    // do nothing
    // if Tile.createTiles is called while the loop is running, it will throw an error
  }
}

function keyPressed() {
  if (Walker.isWalking) {
    return;
  }

  let { x, y } = Tile.walker.currentTile;

  if (keyCode == LEFT_ARROW && x > 0) {
    if (Tile.tiles[x - 1][y].walls[1] == 0) {
      Tile.walker.currentTile = Tile.tiles[x - 1][y];
    }

  } else if (keyCode == RIGHT_ARROW && x < Tile.rows - 1) {
    if (Tile.tiles[x][y].walls[1] == 0) {
      Tile.walker.currentTile = Tile.tiles[x + 1][y];
    }

  } else if (keyCode == UP_ARROW && y > 0) {
    if (Tile.tiles[x][y].walls[0] == 0) {
      Tile.walker.currentTile = Tile.tiles[x][y - 1];
    }

  } else if (keyCode == DOWN_ARROW && y < Tile.columns - 1) {
    if (Tile.tiles[x][y + 1].walls[0] == 0) {
      Tile.walker.currentTile = Tile.tiles[x][y + 1];
    }
  }

  if(Tile.walker.currentTile.x == Tile.rows - 1 && Tile.walker.currentTile.y == Tile.columns - 1) {
    location.reload();
  }
}
