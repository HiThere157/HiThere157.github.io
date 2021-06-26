var tiles = [];
var resolution = 50;
if(/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    resolution *= 2;
}

var xOff;
var yOff;
var playing = true;
var mUp = false;
//vertival/horizontal = 1/4 => 4x horizontal
var mines = 0.12;
var columns = parseInt(window.innerWidth/resolution);
var rows = parseInt(parseInt(window.innerHeight/10)*10/resolution);

function checkGame(){
    let remaining = 0;
    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.show == false && tile.mine == false){
                remaining += 1;
            }
        });
    });

    return remaining;
}

class Popup{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.open = false;
    }

    show(){
        fill("#5252524d");
        rect(this.x, this.y, this.w, this.h)
        fill("FFF")
        rect(this.x+5, this.y+5, resolution-10, resolution-10)
        fill("FF0")
        rect(this.x+5, this.y+resolution+5, resolution-10, resolution-10)
    }

}

var popup = new Popup(0,0,resolution,resolution*2);

class Tile {
    constructor(x, y, p){
        this.x = x;
        this.y = y;
        this.mine = false;
        this.mines_near = "0";
        this.show = false;
        this.re = false;
        this.flag = false;

        if(Math.random() < p){
            this.mine = true;
            //this.show = true;
        }
    }

    count_mines(){
        let temp = 0;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(this.x + i >= 0 && this.x + i < columns && this.y + j >= 0 && this.y + j < rows){
                    if(tiles[this.x + i][this.y + j].mine == true){
                        temp += 1;
                    }
                }
            }
        }
        this.mines_near = temp.toString();
    }

    showNeightbours(){
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(this.x + i >= 0 && this.x + i < columns && this.y + j >= 0 && this.y + j < rows){
                    tiles[this.x + i][this.y + j].showMe();
;                }
            }
        }
    }

    showMe(){
        this.show = true;
        if(this.mine == true){
            alert("You Lost. Refresh to Play again");
            playing = false;
        }else if(this.mines_near == "0" && this.re == false){
            this.re = true;
            this.showNeightbours();
        }
    }
    
}

for(var i = 0; i < columns; i++){
    var tempRow = [];
    for(var j = 0; j < rows; j++){
       tempRow.push(new Tile(i, j, mines));
    }
    tiles.push(tempRow);
}

tiles.forEach(row => {
    row.forEach(tile => {
        tile.count_mines();
    });
});

function click(b){
    var mX = mouseX;
    var mY = mouseY;
    let tile = tiles[parseInt(mX/resolution)][parseInt(mY/resolution)];

    if(b == "LEFT"){
        tile.showMe();
    }else if(b == "RIGHT"){
        tile.flag = !tile.flag;
    }

    if(checkGame() == 0){
        alert("You Won. Refresh to Play again");
        playing = false;
    }
    mUp = true;
}

function setup() {
    let canvas = createCanvas(columns*resolution, rows*resolution);
    background("#000");
    xOff = parseInt((window.innerWidth-columns*resolution)/2);
    yOff = parseInt((window.innerHeight-rows*resolution)/2);
    canvas.position(xOff, yOff);
}

function draw() {
    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.show == true){
                fill("cecece");
            }else{
                fill("#525252");
            }
            
            rect(tile.x*resolution, tile.y*resolution, resolution, resolution);

            if(tile.flag == true){
                fill("red");
                rect(tile.x*resolution+resolution*0.5-10, tile.y*resolution+resolution*0.5-10, 20, 20);
            }

            if(tile.show == true){
                if(tile.mine == true){
                    fill("#000");
                    rect(tile.x*resolution+resolution*0.5-10, tile.y*resolution+resolution*0.5-10, 20, 20);
                }else{
                    if(tile.mines_near != 0){
                        if(tile.mines_near == "1"){
                            fill("blue");
                        }else if(tile.mines_near == "2"){
                            fill("orange");
                        }else{
                            fill("red");
                        }
                        
                        textSize(30);
                        text(tile.mines_near, tile.x*resolution+resolution*0.5-10, tile.y*resolution+resolution*0.5+10);
                    }
                }
            }
        });
    });

    if (mouseIsPressed && playing == true && mUp == false){
        var mX = mouseX;
        var mY = mouseY;
        let tile = tiles[parseInt(mX/resolution)][parseInt(mY/resolution)];

        if (mouseButton === LEFT && tile.flag == false) {
            click("LEFT");
        }
        if (mouseButton === RIGHT && tile.show == false) {
            click("RIGHT");
        }
    }

    if(popup.open == true){
        popup.show();
    }
}

function touchStarted(){
    if(/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        if(popup.open == false){
            popup.open = true;
            popup.x = mouseX;
            popup.y = mouseY;

        }else if(popup.open == true){
            if(mouseX >= popup.x+5 && mouseX <= popup.x+5+resolution-10 && mouseY >= popup.y+5 && mouseY <= popup.y+5+resolution-10){
                click("LEFT");
                popup.open = false;
            }else if(mouseX >= popup.x+5 && mouseX <= popup.x+5+resolution-10 && mouseY >= popup.y+5+resolution && mouseY <= popup.y+5+resolution+40){
                click("RIGHT");
                popup.open = false;
            }
        }
    }
}

function mouseReleased(){
    mUp = false;
}

document.addEventListener('contextmenu', event => event.preventDefault());