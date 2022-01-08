var pages = [
  { title: "Game of Life", desc: "The Game of Life, is a cellular automaton devised by the Mathematician John Horton Conway in 1970", uri: "./4gol/", info: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" },
  { title: "Maze Generator", desc: "Depth First Search (DFS) Maze Generator. One of the simplest ways to generate a maze.", uri: "./6maze/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_depth-first_search" },
  { title: "Mine Sweeper", desc: "Simple implementation of Minesweeper in p5.js", uri: "./9mineSweeper/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Minesweeper_(video_game)" },
  { title: "Ray Cast", desc: "Implementation of an intersection algorithm for 'light rays' on obstacles", uri: "./11rayCast/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Ray_casting" },
  { title: "WebGL", desc: "THREE.js: Easy to use, lightweight, cross-browser, general purpose 3D library using WebGL", uri: "./17webGL/", lib: "three.js", info: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
  { title: "Marching Squares", desc: "Marching squares is a computer graphics algorithm that generates contours for a two-dimensional scalar field", uri: "./19mSquares/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Marching_squares" },
  { title: "Bézier Curve", desc: "Bézier curves are widely used in computer graphics to model smooth curves", uri: "./20bezierCurves/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/B%C3%A9zier_curve" },
  { title: "Lorenz Attractor", desc: "The Lorenz system is a chaotic system of ordinary differential equations", uri: "./22lorenz/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Lorenz_system" },
  { title: "Aizawa Attractor", desc: "The Aizawa Attractor is a chaotic system of ordinary differential equations", uri: "./25aizawa/", lib: "p5.js", info: "https://www.algosome.com/articles/aizawa-attractor-chaos.html" },
  { title: "Lissajous Curves", desc: "A Lissajous curve is the graph of a system of parametric equations which describe complex harmonic motion", uri: "./29lissajous/", lib: "p5.js", info: "https://en.wikipedia.org/wiki/Lissajous_curve" },

  { title: "HTML Shooter", desc: "'Asteroid' like Game for all HTML Websites", uri: "./0shooter/shooter.js" },
  { title: "DataViewer v2", desc: "Online calculator for Data Evaluation", uri: "./10data_viewer_v2/data_viewer.html" }
];

var libColor = {
  "p5.js": "#ed225d",
  "three.js": "#049EF4"
};

const openURI = (uri) => {
  if (uri.includes(".js")) {
    let tmpElement = document.createElement("script");
    tmpElement.src = uri;

    document.body.appendChild(tmpElement);
  } else {
    window.open(uri, "_blank").focus();
  }
};

const cardTemplate = document.getElementById("cardTemplate");
const mainContainer = document.getElementById("mainContainer");

pages.forEach(page => {
  var cardClone = cardTemplate.content.firstElementChild.cloneNode(true);
  var id = page.uri.split("/")[1]
  cardClone.style = `background-image: url(assets/${id}.png)`;
  cardClone.querySelector(".cardTitle").innerText = page.title;
  cardClone.querySelector(".cardDescription").innerText = page.desc;

  cardClone.querySelector(".actionCode").onclick = () => { openURI("https://github.com/HiThere157/HiThere157.github.io/tree/main/" + id); };
  cardClone.querySelector(".actionOpen").onclick = () => { openURI(page.uri); };

  if (page.info) {
    cardClone.querySelector(".actionInfo").onclick = () => { openURI(page.info); };
  } else {
    cardClone.querySelector(".actionInfo").style = "opacity: 0.3; cursor: auto;";
  }

  if (page.lib) {
    cardClone.querySelector(".cardLibName").innerText = page.lib;
    cardClone.style.setProperty("--accent-color", libColor[page.lib]);
  } else {
    cardClone.querySelector(".cardLibContainer").style.display = "none";
  }

  cardClone.onclick = (event) => {
    console.log(event.target);
    if (event.target.className != "actionContainer" && event.target.tagName != "BUTTON") {
      openURI(page.uri);
    }
  }
  mainContainer.appendChild(cardClone);
});
