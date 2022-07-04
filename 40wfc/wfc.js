function skewLeft(array, n) {
  const nextArray = [];
  for (let i = 0; i < array.length; i++) {
    nextArray[(i + n) % array.length] = array[i];
  }
  return nextArray;
}

let tileSideInfo = [];
let tileImages = [];
function loadImages() {
  tileData.forEach((tile) => {
    for (let nRotation = 0; nRotation < tile.rotations; nRotation++) {
      tileImages.push({
        image: loadImage(tile.url),
        nRotation,
        bias: tile.bias,
      });

      tileSideInfo.push(skewLeft(tile.sideInfo, nRotation));
    }
  });
}

let grid = [];
function generateGrid() {
  grid = [];

  const height = Math.floor(windowHeight / settings.tileHeight);
  const width = Math.floor(windowWidth / settings.tileHeight);

  for (let i = 0; i < width * height; i++) {
    grid.push(new Tile(i % width, Math.floor(i / width), tileImages.length));
  }
}

const settings = {};
function setDefaultSettings() {
  settings.tileHeight = 100;
  settings.frameRate = 60;
}

function initOverlay() {
  const pane = new Tweakpane.Pane();
  const general = pane.addFolder({ title: "" });

  general
    .addInput(settings, "tileHeight", {
      min: 20,
      max: 100,
      step: 10,
      label: "Resolution",
    })
    .on("change", generateGrid);

  general.addInput(settings, "frameRate", {
    min: 5,
    max: 120,
    step: 1,
    label: "Speed",
  });

  general.addButton({ title: "New" }).on("click", generateGrid);

  general.addButton({ title: "Reset" }).on("click", () => {
    setDefaultSettings();
    pane.refresh();
  });
}

function setup() {
  imageMode(CENTER);
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  setDefaultSettings();

  initOverlay();
  loadImages();
  generateGrid();
}

function draw() {
  background(200);
  frameRate(settings.frameRate);

  const offset = {
    x:
      windowWidth -
      Math.floor(windowWidth / settings.tileHeight) * settings.tileHeight,
    y:
      windowHeight -
      Math.floor(windowHeight / settings.tileHeight) * settings.tileHeight,
  };

  const nextTile = Tile.leastEntropyTile(grid);
  if (nextTile) {
    nextTile.collapse();
  }

  grid.forEach((tile) => {
    const tilePosition = {
      x: tile.x * settings.tileHeight + settings.tileHeight / 2 + offset.x / 2,
      y: tile.y * settings.tileHeight + settings.tileHeight / 2 + offset.y / 2,
    };
    
    if (tile.tiles.length >= 1) {
      const tileRotation = tileImages[tile.tiles[0]].nRotation * 90;
      const tileImage = tileImages[tile.tiles[0]].image;

      translate(tilePosition.x, tilePosition.y);
      rotate(tileRotation);
      image(tileImage, 0, 0, settings.tileHeight, settings.tileHeight);
      rotate(-tileRotation);
      translate(-tilePosition.x, -tilePosition.y);
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateGrid();
}
