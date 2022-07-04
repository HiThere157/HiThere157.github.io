class Tile {
  static getByCoordinates(x, y) {
    return grid.filter((tile) => {
      return tile.x == x && tile.y == y;
    })[0];
  }

  static leastEntropyTile(grid) {
    const leastEntropyTile = grid
      .sort((a, b) => {
        return a.tiles.length - b.tiles.length;
      })
      .filter((tile) => {
        return tile.tiles.length > 1;
      })[0];

    if (!leastEntropyTile) {
      return undefined;
    }

    const leastEntropyCells = grid.filter((tile) => {
      return tile.tiles.length == leastEntropyTile.tiles.length;
    });

    return leastEntropyCells[
      Math.floor(Math.random() * leastEntropyCells.length)
    ];
  }

  static #checkTileSides(origin, target, originTileSide) {
    const originTileInfo = tileSideInfo[origin.tiles[0]];

    target.tiles = target.tiles.filter((tile) => {
      return (
        /*
          origin: top == target: bottom
          origin: right == target: left
          ...
        */
        originTileInfo[originTileSide] ==
        tileSideInfo[tile][(originTileSide + 2) % 4]
      );
    });

    if (target.tiles.length == 1) {
      Tile.propagateConstraits(target);
    }
  }

  static propagateConstraits(origin) {
    /*
      0: top
      1: right
      2: bottom
      3: left
    */
    const neighbors = [
      Tile.getByCoordinates(origin.x, origin.y - 1),
      Tile.getByCoordinates(origin.x + 1, origin.y),
      Tile.getByCoordinates(origin.x, origin.y + 1),
      Tile.getByCoordinates(origin.x - 1, origin.y),
    ];

    for (let i = 0; i < 4; i++) {
      if (neighbors[i] && neighbors[i].tiles.length > 1) {
        Tile.#checkTileSides(origin, neighbors[i], i);
      }
    }
  }

  constructor(x, y, maxTiles) {
    this.x = x;
    this.y = y;

    this.tiles = [...Array(maxTiles).keys()];
  }

  getRandomWithBias() {
    const tilesWithBias = [];
    this.tiles.forEach((tile) => {
      for (let count = 0; count < tileImages[tile].bias; count++) {
        tilesWithBias.push(tile);
      }
    });

    return tilesWithBias[Math.floor(Math.random() * tilesWithBias.length)];
  }

  collapse() {
    this.tiles = [this.getRandomWithBias()];
    Tile.propagateConstraits(this);
  }
}
