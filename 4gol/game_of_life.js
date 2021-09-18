var width = window.innerWidth;
var height = window.innerHeight;

var resolution = 15;

var rows = parseInt(height / resolution);
var cols = parseInt(width / resolution);

document.getElementById("gridContainer").style.paddingTop = (parseInt((height % resolution) / 2)).toString() + "px";

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 100;

function initializeGrids() {
  for (var i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// Initialize
function initialize() {
  createTable();

  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.height = resolution.toString() + "px";
    tds[i].style.width = resolution.toString() + "px";
  }

  initializeGrids();
  resetGrids();
  setupControlButtons();
}

function setClass(element, param, i, j) {
  element.setAttribute("class", param)
  if (param == "dead") {
    if (i + j > rows + cols / 2) {
      element.style.backgroundColor = "";
    }
  }else if(param == "live"){
    if (i + j > rows + cols / 2) {
      element.style.backgroundColor = "red";
    }
  }
}

// Lay out the board
function createTable() {
  var gridContainer = document.getElementById('gridContainer');
  if (!gridContainer) {
    // Throw error
    console.error("Problem: No div for the drid table!");
  }
  var table = document.createElement("table");

  for (var i = 0; i < rows; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < cols; j++) {//
      var cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      //cell.onclick = cellClickHandler;
      cell.onmouseover = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

function cellClickHandler() {
  var rowcol = this.id.split("_");
  var row = rowcol[0];
  var col = rowcol[1];

  var classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }

}

function updateView() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        setClass(cell, "dead", i, j)
      } else {
        setClass(cell, "live", i, j)
      }
    }
  }
}

function setupControlButtons() {
  document.getElementById("play_pause_button").onclick = function () { startButtonHandler(); };
  document.getElementById("clear_button").onclick = function () { clearButtonHandler(); };
  document.getElementById("random_button").onclick = function () { randomButtonHandler(); };

  randomButtonHandler()
  startButtonHandler()
}

function randomButtonHandler() {
  //if (playing){return;}
  clearButtonHandler();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

// start/pause/continue the game
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    document.getElementById("play_pause_button").style.backgroundImage = "url('icons/play_icon.svg')"
    playing = false;
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    document.getElementById("play_pause_button").style.backgroundImage = "url('icons/pause_icon.svg')"
    playing = true;
    play();
  }
}

function clearButtonHandler() {
  console.log("Cleared the grid");

  //playing = false;
  //clearTimeout(timer);

  var cellsList = document.getElementsByClassName("live");
  // convert to array first, otherwise, you're working on a live node list
  // and the update doesn't work!
  var cells = [];
  for (var i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids();
}

// run the life game
function play() {
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  // copy NextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  // copy all 1 values to "live" in the table
  updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
  var numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}

function countNeighbors(row, col) {
  var count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

document.addEventListener('keydown', logKey);
function logKey(e) {
  if (e.code == "Space") {
    startButtonHandler()
  } else if (e.code == "KeyC") {
    clearButtonHandler()
  } else if (e.code == "KeyR") {
    randomButtonHandler()
  }
}

// Start everything
window.onload = initialize;
window.onresize = function () { location.reload(); }