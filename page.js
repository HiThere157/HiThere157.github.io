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
  "icon0": ["Game of Life", "./4gol/"], "icon1": ["Maze Generator", "./6maze/"],
  "icon2": ["Mine Sweeper", "./9mineSweeper/"], "icon3": ["Snake", "./13snake/"],

  "icon7": ["Ray Cast", "./11rayCast/"], "icon8": ["WebGL", "./17webGL/"],
  "icon9": ["Marching Squares", "./19mSquares/"],

  "icon12": ["HTML Shooter", "shooter/shooter.js"], "icon13": ["DataViewer v2", "./10data_viewer_v2/data_viewer.html"]
}
var key = Object.keys(list);

function setNames() {
  for (var i = 0; i < key.length; i++) {
    document.getElementsByName(key[i])[0].innerText = list[key[i]][0];
    document.getElementsByName(key[i] + "_i")[0].innerText = key[i].substring(4, key[i].length);
  }
}

function setupIcons() {
  var main = document.getElementById("overlay_main");
  for (var j = 0; j < 14; j++) {
    //icon container
    var iconDiv = document.createElement("div");
    var iconId = "icon" + j.toString();
    iconDiv.className = "main_icons";
    iconDiv.onclick = function () { click_icon(this); };
    iconDiv.id = iconId;

    //icon index
    var iconI = document.createElement("p");
    iconI.setAttribute("name", iconId.toString() + "_i");
    iconI.className = "main_i";
    iconDiv.appendChild(iconI);

    //icon name
    var iconP = document.createElement("p");
    iconP.setAttribute("name", iconId);
    iconP.className = "main_p";
    iconDiv.appendChild(iconP);

    main.appendChild(iconDiv);
  }

  setNames();
}
setupIcons();