var prefix = "CHESS-P2P-157-"
var peer = new Peer(prefix + parseInt(Math.random() * 999999).toString(16));
var connection = undefined;

peer.on('open', function (id) {
  document.getElementById("yourID").innerText = id.split("-").reverse()[0];
});

peer.on("disconnected", function () {
  connection = undefined;
  console.log("connection Lost")
});

function connectToPeer() {
  if (connection == undefined) {
    createListener(peer.connect(prefix + document.getElementById("friendID").value));
    setTimeout(function () { connection.send({ "readyCheck": 0 }) }, 1000)
  }
}

peer.on('connection', function (conn) {
  createListener(conn);
});

function createListener(conn) {
  connection = conn;
  connection.on('data', function (data) {
    console.log(data);

    if (data["readyCheck"] == 0) {
      connection.send({ "readyCheck": 1 })
      setBoard(true);

    } else if (data["readyCheck"] == 1) {
      setBoard(false);

    } else if (data["newBoard"] != undefined) {
      board = data["newBoard"];
      move = true;
      setBoard();
    }

  });
}

function sendData() {
  if (connection != undefined) {
    connection.send("aaaaaaaaaaaaaaaaaaaaa;")
  }
}

/* chess game logic */
var board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
]

var castling = [true, true];

var lookupTable = {
  "": "",
  "r": "t",
  "n": "m",
  "b": "v",
  "q": "w",
  "k": "l",
  "p": "o",
  "R": "r",
  "N": "n",
  "B": "b",
  "Q": "q",
  "K": "k",
  "P": "p"
}

/* set/update board */
var reverse;
var move;
function setBoard(rev = undefined) {
  if (rev != undefined) {
    reverse = rev;
    move = !rev;
  }

  let TBoard = "<table>";
  for (let i = 0; i < 8; i++) {
    TBoard += "<tr>";
    for (let j = 0; j < 8; j++) {
      let _class = "bBg";
      if ((i + j) % 2 == 0) {
        _class = "wBg";
      }

      let piece = board[Math.abs((7 * reverse) - i)][Math.abs((7 * reverse) - j)];

      let _name = "true";
      if (piece == piece.toUpperCase()) {
        _name = "false";
      }

      TBoard += `<td class=${_class}><div class=piece name=${_name} id=p${i}${j}>${lookupTable[piece]}</div></td>`;
    }
    TBoard += "</tr>";
  }

  document.getElementById("board").innerHTML = TBoard;
  [...document.getElementsByClassName("piece")].forEach(element => { dragElement(element) });
}
setBoard(false);

/* check for legal move */
function makeMove(from, to, color) {
  from[0] = parseInt(from[0])
  from[1] = parseInt(from[1])

  to[0] = parseInt(to[0])
  to[1] = parseInt(to[1])

  if (move && color == "" + reverse && to != color) {
    let piece = board[Math.abs((7 * reverse) - from[0])][Math.abs((7 * reverse) - from[1])];

    if (connection != undefined && getLegal(piece.toLowerCase(), from).indexOf(to.join()) != -1) {

      /* auto promote */
      if (piece.toLowerCase() == "p" && (to[0] == 7 || to[0] == 0)) {
        piece = "Q";

        if (piece == piece.toLowerCase()) {
          piece = "q";
        }
      }

      /* castling */
      if (piece.toLowerCase() == "k") {
        castling = [false, false];
      }
      if (from[0] == 7 && from[1] == 0) {
        castling[0] = false;
      } else if (from[0] == 7 && from[1] == 7) {
        castling[1] = false;
      }

      board[Math.abs((7 * reverse) - to[0])][Math.abs((7 * reverse) - to[1])] = piece;
      board[Math.abs((7 * reverse) - from[0])][Math.abs((7 * reverse) - from[1])] = "";

      connection.send({ "newBoard": board });
      move = false;
    }
  }
  setBoard();
}

function getKing() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let piece = board[Math.abs((7 * reverse) - i)][Math.abs((7 * reverse) - j)];
      if (piece.toLowerCase() == "k" && (piece == piece.toUpperCase()) != reverse) {
        return [i, j];
      }
    }
  }
}

function copyBoard(b) {
  let newBoard = [];
  if (typeof b == "object") {
    b.forEach(br => {
      newBoard.push(copyBoard(br));
    })
    return newBoard;

  }
  return b;
}

function isCheck(b) {
  let pieces = ["k", "p", "r", "b", "q", "k"];
  let check = false;

  if (reverse != false) {
    pieces = pieces.map(p => p.toUpperCase());
  }

  pieces.forEach(p => {
    getLegal(p.toLowerCase(), getKing(), reverse, true, false).forEach(moveStr => {
      let move = moveStr.split(",");
      move[0] = parseInt(move[0])
      move[1] = parseInt(move[1])

      let attacker = b[Math.abs((7 * reverse) - move[0])][Math.abs((7 * reverse) - move[1])];

      if (attacker == p) {
        check = true;
      }
    })
  })

  return check
}

function getLegal(p, pos, rev = reverse, skipCheck = false, recurse = true) {
  directions = [];
  radius = 9;

  if (["k", "p", "n"].indexOf(p) != -1) {
    radius = 1;
    if (p == "p" && (pos[0] == 6 || pos[0] == 1)) {
      radius = 2;
    }
  }

  if (["r", "q", "k"].indexOf(p) != -1) {
    directions.push(...[[1, 0], [-1, 0], [0, 1], [0, -1]]);
  }

  if (["b", "q", "k"].indexOf(p) != -1) {
    directions.push(...[[1, 1], [-1, -1], [1, -1], [-1, 1]]);
  }

  if (p == "p") {
    directions.push([-1, 0], [-1, 1], [-1, -1]);
  } else if (p == "n") {
    directions.push(...[[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]);
  }

  let ret = [];
  checkMove(pos, directions, radius, p, rev, skipCheck).forEach(moveStr => {
    let move = moveStr.split(",");
    move[0] = parseInt(move[0]);
    move[1] = parseInt(move[1]);

    let tmpBoard = copyBoard(board);
    let piece = tmpBoard[Math.abs((7 * reverse) - pos[0])][Math.abs((7 * reverse) - pos[1])];
    tmpBoard[Math.abs((7 * reverse) - move[0])][Math.abs((7 * reverse) - move[1])] = piece;
    tmpBoard[Math.abs((7 * reverse) - pos[0])][Math.abs((7 * reverse) - pos[1])] = "";

    if (recurse) {
      if (isCheck(tmpBoard) == false) {
        ret.push(moveStr);
      }
    } else {
      ret.push(moveStr);
    }

  })

  return ret;
}

function checkMove(pos, directions, radius, p, rev, skipCheck = false) {
  let ret = []
  let dId = 0;

  directions.forEach(pre => {
    let n = 0, i = pos[0], j = pos[1], di = pre[0], dj = pre[1];
    do {
      n += 1;
      i += di;
      j += dj;

      // Running into any color piece terminates the loop.
      // However, running into an opposite color piece adds one last legal move.
      var onBoard = (i >= 0) && (i < 8) && (j >= 0) && (j < 8);

      if (onBoard) {
        let tp = board[Math.abs((7 * rev) - i)][Math.abs((7 * rev) - j)]

        var samePiece = ((tp == tp.toUpperCase()) != rev && tp != "");
        var oppPiece = (tp == tp.toUpperCase()) == rev && tp != "";

        if (skipCheck == false) {
          if (p == "p") {
            if (dId == 0) {
              if (!samePiece && !oppPiece) {
                ret.push([i, j].join());
              }
            } else {
              if (!samePiece && tp != "" && n == 1) {
                ret.push([i, j].join());
              }
            }

          } else {
            if (!samePiece) {
              ret.push([i, j].join());
            }
          }

        } else {
          if (p == "p") {
            if (dId != 0) {
              ret.push([i, j].join());
            }
          } else {
            ret.push([i, j].join());
          }
        }
      }
    } while (onBoard && !samePiece && !oppPiece && n < radius);
    dId += 1;
  })
  return ret;
}

/* get absolute pos of an element */
function absolutePos(element) {
  var top = 0, left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;

  } while (element);

  return [left, top];
};

/* drag handhandler */
function dragElement(element) {
  var dX = 0, dY = 0, oX = 0, oY = 0, h = parseFloat(window.getComputedStyle(element).height);
  element.onmousedown = dragMouseDown;

  function dragMouseDown(event) {
    event = event || window.event;
    event.preventDefault();

    oX = event.clientX;
    oY = event.clientY;

    var [aX, aY] = absolutePos(element);

    dX = oX - aX;
    dY = oY - aY;

    element.style.top = (dY - h / 2) + "px";
    element.style.left = (dX - h / 2) + "px";

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    element.style.zIndex = 3;
  }

  function elementDrag(event) {
    event = event || window.event;
    event.preventDefault();

    dX = oX - event.clientX;
    dY = oY - event.clientY;
    oX = event.clientX;
    oY = event.clientY;

    element.style.top = (element.offsetTop - dY) + "px";
    element.style.left = (element.offsetLeft - dX) + "px";
  }

  function closeDragElement(event) {
    event = event || window.event;
    event.preventDefault();

    document.onmouseup = null;
    document.onmousemove = null;
    element.style.zIndex = 1;

    makeMove(element.id.substring(1).split(""), document.elementFromPoint(event.clientX, event.clientY).id.substring(1).split(""), element.getAttribute("name"));
  }
}