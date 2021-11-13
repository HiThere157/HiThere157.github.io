function click_icon(elem) {
  let href = list[elem.id][1].split(".");

  if (href[href.length - 1] == "html" || href.length == 1) {
    window.location.href = href.join(".");

  } else if (href[href.length - 1] == "js") {
    let tmp = document.createElement("script");
    tmp.src = href.join(".");

    document.body.appendChild(tmp);
  }
}

var list = {
  "icon0": ["Game of Life", "/4gol/"], "icon1": ["Maze Generator", "/6maze/"],
  "icon2": ["Mine Sweeper", "/9mineSweeper/"], "icon3": ["Snake", "/13snake/"],

  "icon7": ["Ray Cast", "/11rayCast/"], "icon8": ["WebGL", "/17webGL/"],
  "icon9": ["Marching Squares", "/19mSquares/"],

  "icon12": ["HTML Shooter", "shooter/shooter.js"], "icon13": ["DataViewer v2", "/10data_viewer_v2/data_viewer.html"]
}
var key = Object.keys(list);

function refresh_Icons() {
  for (var i = 0; i < key.length; i++) {
    document.getElementsByName(key[i])[0].innerText = list[key[i]][0];
    document.getElementsByName(key[i] + "_i")[0].innerText = key[i].substring(4, key[i].length);
  }
}

function setupIcons() {
  var main = document.getElementById("overlay_main");
  for (var j = 0; j < 14; j++) {
    var iconDiv = document.createElement("div");
    var iconId = "icon" + j.toString();
    iconDiv.className = "main_icons";
    iconDiv.onclick = function () { click_icon(this); };
    iconDiv.id = iconId;

    var iconI = document.createElement("p");
    iconI.setAttribute("name", iconId.toString() + "_i");
    iconI.className = "main_i";
    iconDiv.appendChild(iconI);

    var iconP = document.createElement("p");
    iconP.setAttribute("name", iconId);
    iconP.className = "main_p";
    iconDiv.appendChild(iconP);

    main.appendChild(iconDiv);
  }

  refresh_Icons();
}
setupIcons();