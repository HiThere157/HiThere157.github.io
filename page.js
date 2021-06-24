function click_icon(elem) {
    window.location.href = list[elem.id][1];
}

var list = {"icon0-0": ["Game of Life", "/4gol/game_of_life.html"], "icon0-1": ["Maze Generator", "/6maze/maze.html"]}

function refresh_Icons() {
    var key = Object.keys(list);
    for(var i = 0; i < key.length; i++){
        document.getElementsByName(key[i])[0].innerText = list[key[i]][0];
    }
}

function setupIcons() {
    var main = document.getElementById("overlay_main");
    for(var i = 0; i < 2; i++){
        var row = document.createElement("div");
        row.className = "overlay_rows";
        row.id = "row" + i.toString();

        if(i != 0){
            row.style = "padding-top: 25px;";
        }

        main.appendChild(row);

        for(var j = 0; j < 6; j++){
            var iconDiv = document.createElement("div");
            var iconId = "icon" + i.toString() + "-" + j.toString();
            iconDiv.className = "main_icons";
            iconDiv.onclick = function() { click_icon(this); };
            iconDiv.id = iconId;

            var iconP = document.createElement("p");
            iconP.setAttribute("name", iconId);
            iconP.style.width = "100px";
            iconDiv.appendChild(iconP);

            row.appendChild(iconDiv);
        }
    }
    refresh_Icons();
}

setupIcons();
