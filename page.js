function click_icon(elem) {
  let href = list[elem.id][1];
  if (href.includes(".js")) {
    let tmp = document.createElement("script");
    tmp.src = href;

    document.body.appendChild(tmp);

  } else {
    window.location.href = href;
  }
}

var list = {
  "icon0": ["Game of Life", "./4gol/"],
  "icon1": ["Maze Generator", "./6maze/", "p5"],
  "icon2": ["Mine Sweeper", "./9mineSweeper/", "p5"],
  "icon3": ["Snake", "./13snake/", "p5"],
  "icon4": ["WebGL", "./17webGL/", "three.js"],

  "icon5": ["HTML Shooter", "shooter/shooter.js"],
  "icon6": ["DataViewer v2", "./10data_viewer_v2/data_viewer.html"],

  "icon7": ["Ray Cast", "./11rayCast/", "p5"],
  "icon8": ["Marching Squares", "./19mSquares/", "p5"],
  "icon9": ["Bezier Curve", "./20bezierCurves/", "p5"],
  "icon10": ["Lorenz Attractor", "./22lorenz/", "p5"],
  "icon11": ["Aizawa Attractor", "./25aizawa/", "p5"],
  "icon12": ["Cardioid", "./27cardioid/", "p5"],
  "icon13": ["Lissajous Curves", "./29lissajous/", "p5"]
}
var keys = Object.keys(list);

function setNames() {
  for (var i = 0; i < keys.length; i++) {
    document.getElementById(keys[i] + "_name").innerText = list[keys[i]][0];
    document.getElementById(keys[i] + "_index").innerText = keys[i].substring(4, keys[i].length);
    document.getElementById(keys[i] + "_frame").innerText =  "";
  }
}

function setupIcons() {
  var main = document.getElementById("overlayMain");
  for (var j = 0; j < 14; j++) {
    var iconId = "icon" + j;
    //icon container
    var iconDiv = document.createElement("div");
    iconDiv.id = iconId;
    iconDiv.className = "mainIcon";
    iconDiv.onclick = function () { click_icon(this); };

    //icon index
    var iconIndex = document.createElement("span");
    iconIndex.id = iconId + "_index";
    iconIndex.className = "indexSpan";
    iconDiv.appendChild(iconIndex);

    //icon name
    var iconName = document.createElement("span");
    iconName.id = iconId + "_name";
    iconDiv.appendChild(iconName);

    //icon Framework
    var iconFrame = document.createElement("div");
    iconFrame.id = iconId + "_frame";
    iconFrame.className = "frameworkSpan";
    iconDiv.appendChild(iconFrame);

    main.appendChild(iconDiv);
  }

  setNames();
}
setupIcons();