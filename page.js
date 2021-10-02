function click_icon(elem, hover = false) {
  if (elem == undefined || list[elem.id] == undefined) {
    // document.getElementById("backgroundIFrame").src = "";
    return
  }

  let href = list[elem.id][1].split(".");

  if (href[href.length - 1] == "html") {
    if (hover == false) {
      window.location.href = href.join(".");
    } else {
      // document.getElementById("backgroundIFrame").src = href.join(".");
    }

  } else if (href[href.length - 1] == "js" && hover == false) {
    let tmp = document.createElement("script");
    tmp.src = href.join(".");

    document.body.appendChild(tmp);
  }
}

var list = { "icon0": ["Game of Life", "/4gol/index.html"], "icon1": ["Maze Generator", "/6maze/index.html"], "icon2": ["Mine Sweeper", "/9mineSweeper/index.html"], "icon3": ["Snake", "/13snake/index.html"], "icon4": ["Ray Cast", "/11rayCast/index.html"], "icon5": ["HTML Shooter", "shooter/shooter.js"], "icon12": ["Timetable", "/15timetable/index.html"], "icon13": ["DataViewer v2", "/10data_viewer_v2/data_viewer.html"] }
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
    iconDiv.onmouseover = function () { click_icon(this, true); };
    iconDiv.onmouseleave = function () { click_icon(undefined, true); };
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